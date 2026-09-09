import { describe, expect, it } from "vitest";
import { NarrowApi } from "../../src/presentation/narrow-api";
import type { ProcessarAtivo } from "../../src/domain/usecases/processar-ativo";

describe("NarrowApi", () => {
  it("deve encaminhar somente a solicitação opaca e retornar o veredito", async () => {
    const chamadas: unknown[] = [];
    const segredo = "PLAINTEXT_SECRET_FLAG_FD_CORE_2026";
    const processarAtivo: ProcessarAtivo = async (input) => {
      chamadas.push(input);
      return {
        kind: "success",
        value: {
          veredito: "autorizado",
          timestampExecucao: "2026-09-08T00:00:00.000Z",
        },
      };
    };

    const resposta = await new NarrowApi(processarAtivo).processar({
      referenciaOpaca: "ref-opaca-001",
      assinaturaValidacao: "ASSINATURA_VALIDA_sintetica",
    });

    expect(chamadas).toEqual([{
      referenciaOpaca: "ref-opaca-001",
      assinaturaValidacao: "ASSINATURA_VALIDA_sintetica",
    }]);
    expect(resposta.status).toBe("sucesso");
    expect(resposta.veredito).toBe("autorizado");
    expect(JSON.stringify(resposta)).not.toContain(segredo);
    expect(resposta).not.toHaveProperty("payloadCifrado");
  });

  it("deve converter falha tipada em resposta estreita sem propagar detalhes protegidos", async () => {
    const segredo = "PLAINTEXT_SECRET_FLAG_FD_CORE_2026";
    const processarAtivo: ProcessarAtivo = async () => ({
      kind: "failure",
      error: { kind: "assinatura-invalida" },
    });

    const resposta = await new NarrowApi(processarAtivo).processar({
      referenciaOpaca: "ref-opaca-002",
      assinaturaValidacao: "ASSINATURA_CORROMPIDA",
    });

    expect(resposta.status).toBe("erro");
    expect(resposta.erroCodigo).toBe("assinatura-invalida");
    expect(JSON.stringify(resposta)).not.toContain(segredo);
    expect(resposta).not.toHaveProperty("stack");
  });
});
