import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { makeProcessarAtivo } from "../../src/domain/usecases/processar-ativo";
import { success, failure, type Result } from "../../src/domain/result";
import type { AtivoLogicoProtegido } from "../../src/domain/entities/ativo";
import type { AtivoRepository } from "../../src/domain/repositories/ativo-repository";
import type { ProcessamentoFailure } from "../../src/domain/failures/processamento-failure";

/**
 * Testes Determinísticos de Exfiltração (T006 / SC-002 / SC-003)
 * 
 * Objetivo: Comprovar que o Cofre opera de forma segura na sandbox local,
 * garantindo por meio de asserções rígidas que nenhum plaintext ou metadado
 * confidencial vaza nos canais de saída padrão (logs) ou nos retornos de erro.
 */
describe("Testes de Exfiltração (Sandbox)", () => {
  let logSpy: any;
  let errorSpy: any;
  let stdoutSpy: any;
  let stderrSpy: any;

  // Flag exclusiva usada para testar o confinamento de segredos
  const PLAINTEXT_SECRET_FLAG = "PLAINTEXT_SECRET_FLAG_FD_CORE_2026";

  // Repositório Fake para simular o comportamento de custódia
  class FakeAtivoRepository implements AtivoRepository {
    private assets = new Map<string, AtivoLogicoProtegido>();

    async buscarPorReferencia(referenciaOpaca: string): Promise<AtivoLogicoProtegido | null> {
      return this.assets.get(referenciaOpaca) || null;
    }

    async salvarSintetico(ativo: AtivoLogicoProtegido): Promise<void> {
      this.assets.set(ativo.chaveReferencia, ativo);
    }
  }

  beforeEach(() => {
    // Inicialização dos spies do Vitest para monitorar todos os canais de saída
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    // Restaura os comportamentos originais dos métodos espionados
    vi.restoreAllMocks();
  });

  /**
   * Helper para verificar se a flag secreta vazou em algum canal monitorado.
   * Retorna true se houver qualquer ocorrência do plaintext nos logs ou saídas padrão.
   */
  const checkExfiltrationOccurrences = (): boolean => {
    const allCalls = [
      ...logSpy.mock.calls.flatMap((c: any) => c),
      ...errorSpy.mock.calls.flatMap((c: any) => c),
      ...stdoutSpy.mock.calls.flatMap((c: any) => c),
      ...stderrSpy.mock.calls.flatMap((c: any) => c),
    ].map(val => String(valueToString(val)));

    return allCalls.some(str => str.includes(PLAINTEXT_SECRET_FLAG));
  };

  const valueToString = (val: any): string => {
    if (val instanceof Buffer) return val.toString("utf8");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // --- SCENARIO TESTS ---\n

  it("SC-001 / SC-002: Processa ativo sintético com sucesso SEM exfiltrar plaintext nos logs", async () => {
    // Arrange: Prepara o cenário de sandbox com o ativo lógico protegido contendo o segredo
    const repo = new FakeAtivoRepository();
    const useCase = makeProcessarAtivo(repo);

    const assetRef = "opaque-ref-uuid-001";
    const syntheticAsset: AtivoLogicoProtegido = {
      id: "sintetico-1",
      chaveReferencia: assetRef,
      hashPolitica: "valid-policy-sha256",
      payloadCifrado: `CIFRADO:${PLAINTEXT_SECRET_FLAG}`, // Payload contém a nossa string de controle
      createdAt: new Date().toISOString(),
    };

    await repo.salvarSintetico(syntheticAsset);

    // Act: Executa o processamento via API/Use Case usando apenas a referência lógica opaca
    const result = await useCase.executar({
      referenciaOpaca: assetRef,
      assinaturaValidacao: "valid-signature-key-2026",
    });

    // Assert 1: O resultado deve ser estritamente tipado e indicar sucesso
    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.value.veredito).toBe("autorizado");
      // O resultado de sucesso NÃO pode conter o plaintext de exfiltração
      expect(JSON.stringify(result.value)).not.toContain(PLAINTEXT_SECRET_FLAG);
    }

    // Assert 2: Validação determinística de logs. Tamanho de vazamento = zero bytes
    expect(checkExfiltrationOccurrences()).toBe(false);
  });

  it("SC-003: Bloqueia transação inválida e retorna Erro como Valor SEM vazar stack-traces ou plaintext", async () => {
    // Arrange
    const repo = new FakeAtivoRepository();
    const useCase = makeProcessarAtivo(repo);

    const assetRef = "opaque-ref-uuid-002";
    const syntheticAsset: AtivoLogicoProtegido = {
      id: "sintetico-2",
      chaveReferencia: assetRef,
      hashPolitica: "valid-policy-sha256",
      payloadCifrado: `CIFRADO:${PLAINTEXT_SECRET_FLAG}`,
      createdAt: new Date().toISOString(),
    };

    await repo.salvarSintetico(syntheticAsset);

    // Act: Força uma falha fornecendo uma assinatura corrompida
    const result = await useCase.executar({
      referenciaOpaca: assetRef,
      assinaturaValidacao: "CORRUPTED_SIGNATURE",
    });

    // Assert 1: Retorna erro tipado em vez de disparar uma exceção de runtime (Princípio do Erro como Valor)
    expect(result.kind).toBe("failure");
    if (result.kind === "failure") {
      expect(result.error.kind).toBe("assinatura-invalida");
      
      // O contrato de falha NÃO pode concatenar ou expor informações do payload ou o segredo
      expect(JSON.stringify(result.error)).not.toContain(PLAINTEXT_SECRET_FLAG);
    }

    // Assert 2: Os spies confirmam que console.error ou stdout não registraram o segredo na tentativa de invasão
    expect(checkExfiltrationOccurrences()).toBe(false);
  });

  it("SC-002/SC-003 (Morte Súbita): Garante que testes de exfiltração reprovam o pipeline se houver vazamento deliberado", async () => {
    // Arrange: Simula um componente defeituoso ou malicioso que tenta ativamente registrar o segredo
    const repo = new FakeAtivoRepository();
    
    // Forçamos o comportamento de log intencional
    const maliciousLogAction = () => {
      console.log(`[AUDIT_FAIL] Vazamento malicioso de ativo protegido: ${PLAINTEXT_SECRET_FLAG}`);
    };

    // Act
    maliciousLogAction();

    // Assert: O monitoramento de exfiltração detecta imediatamente o vazamento e força a falha do teste
    expect(checkExfiltrationOccurrences()).toBe(true); 
    // Nota: Em um teste de segurança ativo, esta asserção garante o 'RED' (falha imediata do build) se houver vazamento.
  });
});
