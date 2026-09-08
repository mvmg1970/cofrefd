import { describe, expect, it } from "vitest";
import { createSandboxStore } from "../../src/presentation/store/sandbox-store";
import { makeProcessarAtivo } from "../../src/domain/usecases/processar-ativo";
import { InMemoryAtivoRepository } from "../../src/data/in-memory-ativo-repository";
import type { AtivoLogicoProtegido } from "../../src/domain/entities/ativo";

describe("SandboxStore (Presentation)", () => {
  const seedStore = () => {
    const repository = new InMemoryAtivoRepository();
    const processarAtivo = makeProcessarAtivo(repository);
    const store = createSandboxStore(processarAtivo, repository);
    return { store, repository };
  };

  it("deve inicializar com o estado limpo e seguro", () => {
    const { store } = seedStore();
    const state = store.getState();

    expect(state.loading).toBe(false);
    expect(state.lastError).toBeNull();
    expect(state.logs).toHaveLength(0);
    expect(state.resultadoProcessamento).toBeNull();
  });

  it("deve processar ativo sintético com sucesso e atualizar o estado", async () => {
    const { store, repository } = seedStore();
    
    const ativo: AtivoLogicoProtegido = {
      id: "uuid-sintetico-123",
      chaveReferencia: "ref-opaca-xyz",
      hashPolitica: "hash-sha256-politica",
      payloadCifrado: "payload-super-secreto-cifrado",
      createdAt: new Date().toISOString(),
    };

    await repository.salvarSintetico(ativo);

    const success = await store.getState().processarAtivo("ref-opaca-xyz", "ASSINATURA_VALIDA_key-2026");

    expect(success).toBe(true);
    
    const state = store.getState();
    expect(state.loading).toBe(false);
    expect(state.lastError).toBeNull();
    expect(state.resultadoProcessamento).toEqual({
      veredito: "autorizado",
      timestampExecucao: expect.any(String)
    });
    
    expect(state.logs.some(log => log.includes("payload-super-secreto-cifrado"))).toBe(false);
  });

  it("deve capturar falha de assinatura inválida e expor erro amigável sem vazar stack-trace", async () => {
    const { store, repository } = seedStore();

    const ativo: AtivoLogicoProtegido = {
      id: "uuid-sintetico-456",
      chaveReferencia: "ref-opaca-abc",
      hashPolitica: "hash-sha256-politica-abc",
      payloadCifrado: "outro-payload-cifrado",
      createdAt: new Date().toISOString(),
    };

    await repository.salvarSintetico(ativo);

    const success = await store.getState().processarAtivo("ref-opaca-abc", "CHAVE_CORROMPIDA");

    expect(success).toBe(false);

    const state = store.getState();
    expect(state.loading).toBe(false);
    expect(state.resultadoProcessamento).toBeNull();
    expect(state.lastError).toBe("Falha de segurança: Assinatura inválida ou corrompida.");
    expect(state.logs).toContain("Erro no processamento: assinatura-invalida");
  });

  it("deve capturar falha de ativo não encontrado", async () => {
    const { store } = seedStore();

    const success = await store.getState().processarAtivo("ref-inexistente", "any-signature");

    expect(success).toBe(false);

    const state = store.getState();
    expect(state.lastError).toBe("Ativo lógico protegido não foi encontrado na sandbox.");
  });
});
