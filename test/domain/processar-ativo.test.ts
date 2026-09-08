import { describe, expect, it } from "vitest";
import { makeProcessarAtivo } from "../../src/domain/usecases/processar-ativo";
import type { AtivoLogicoProtegido } from "../../src/domain/entities/ativo";
import type { AtivoRepository } from "../../src/domain/repositories/ativo-repository";

// Repositório duplo (Fake) em memória para isolar os testes do Use Case
class FakeAtivoRepository implements AtivoRepository {
  private ativos = new Map<string, AtivoLogicoProtegido>();

  async buscarPorReferencia(referenciaOpaca: string): Promise<AtivoLogicoProtegido | null> {
    return this.ativos.get(referenciaOpaca) ?? null;
  }

  async salvarSintetico(ativo: AtivoLogicoProtegido): Promise<void> {
    this.ativos.set(ativo.chaveReferencia, ativo);
  }
}

describe("Use Case: ProcessarAtivo (TDD)", () => {
  it("deve processar e autorizar um ativo sintético com referência e assinatura válidas", async () => {
    const repository = new FakeAtivoRepository();
    const processarAtivo = makeProcessarAtivo(repository);

    // Salva uma fixture sintética ativa no repositório de teste
    const ativoSintetico: AtivoLogicoProtegido = {
      id: "sintetico-uuid-1",
      chaveReferencia: "REF-OPACA-ABC123XYZ",
      hashPolitica: "hash-sha256-politica-sintetica",
      payloadCifrado: "PLAINTEXT_SECRET_FLAG_CONTEUDO_PROTEGIDO",
      createdAt: new Date().toISOString(),
    };
    await repository.salvarSintetico(ativoSintetico);

    const result = await processarAtivo({
      referenciaOpaca: "REF-OPACA-ABC123XYZ",
      assinaturaValidacao: "ASSINATURA_VALIDA_abc123",
    });

    expect(result.kind).toBe("success");
    if (result.kind === "success") {
      expect(result.value.veredito).toBe("autorizado");
      expect(result.value.timestampExecucao).toBeDefined();
    }
  });

  it("deve retornar erro 'ativo-nao-encontrado' quando a referência opaca não existir", async () => {
    const repository = new FakeAtivoRepository();
    const processarAtivo = makeProcessarAtivo(repository);

    const result = await processarAtivo({
      referenciaOpaca: "REFERENCIA_INEXISTENTE",
      assinaturaValidacao: "ASSINATURA_VALIDA_abc123",
    });

    expect(result).toEqual({
      kind: "failure",
      error: { kind: "ativo-nao-encontrado" },
    });
  });

  it("deve retornar erro 'assinatura-invalida' se a assinatura de validação do ativo for inválida", async () => {
    const repository = new FakeAtivoRepository();
    const processarAtivo = makeProcessarAtivo(repository);

    const ativoSintetico: AtivoLogicoProtegido = {
      id: "sintetico-uuid-2",
      chaveReferencia: "REF-OPACA-12345",
      hashPolitica: "hash-sha-politica",
      payloadCifrado: "CONTEUDO_CRIPTOGRAFADO_SINTETICO",
      createdAt: new Date().toISOString(),
    };
    await repository.salvarSintetico(ativoSintetico);

    const result = await processarAtivo({
      referenciaOpaca: "REF-OPACA-12345",
      assinaturaValidacao: "ASSINATURA_CORROMPIDA_OU_INVALIDA",
    });

    expect(result).toEqual({
      kind: "failure",
      error: { kind: "assinatura-invalida" },
    });
  });
});
