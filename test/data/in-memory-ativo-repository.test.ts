import { describe, expect, it } from "vitest";
import { InMemoryAtivoRepository } from "../../src/data/in-memory-ativo-repository";
import type { AtivoLogicoProtegido } from "../../src/domain/entities/ativo";

describe("InMemoryAtivoRepository", () => {
  it("deve retornar null se o ativo não for encontrado", async () => {
    const repository = new InMemoryAtivoRepository();
    const result = await repository.buscarPorReferencia("referencia-inexistente");
    expect(result).toBeNull();
  });

  it("deve salvar e buscar um ativo por sua referência opaca", async () => {
    const repository = new InMemoryAtivoRepository();
    const ativo: AtivoLogicoProtegido = {
      id: "sintetico-1",
      chaveReferencia: "ref-opaca-123",
      hashPolitica: "hash-hash-hash",
      payloadCifrado: "payload-protegido-sintetico",
      createdAt: new Date().toISOString(),
    };

    await repository.salvarSintetico(ativo);
    const result = await repository.buscarPorReferencia("ref-opaca-123");

    expect(result).toEqual(ativo);
  });
});
