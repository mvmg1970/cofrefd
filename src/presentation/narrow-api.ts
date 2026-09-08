import type { ProcessarAtivo } from "../domain/usecases/processar-ativo";
import type { Result } from "../domain/result";
import type { ProcessamentoFailure } from "../domain/failures/processamento-failure";

export type NarrowApiInput = {
  readonly referenciaOpaca: string;
  readonly assinaturaValidacao: string;
};

export type NarrowApiOutput = {
  readonly status: \"sucesso\" | \"erro\";
  readonly veredito?: \"autorizado\" | \"negado\";
  readonly erroCodigo?: string;
  readonly timestamp: string;
};

/**
 * Adaptador de Entrada (Primary Adapter) representando a Narrow API do Cofre.
 * 
 * Ela é o único ponto de contato externo (API estreita) pelo qual o FD-Core solicita
 * processamento ao cofre. Ela recebe apenas referências lógicas opacas [3, 8].
 * O plaintext do ativo lógico protegido nunca trafega ou é exposto pelas bordas desta API [3, 8].
 */
export class NarrowApi {
  constructor(private readonly processarAtivo: ProcessarAtivo) {}

  async processar(requisicao: NarrowApiInput): Promise<NarrowApiOutput> {
    const result = await this.processarAtivo({
      referenciaOpaca: requisicao.referenciaOpaca,
      assinaturaValidacao: requisicao.assinaturaValidacao,
    });

    const timestamp = new Date().toISOString();

    if (result.kind === \"failure\") {
      return {
        status: \"erro\",
        erroCodigo: result.error.kind,
        timestamp,
      };
    }

    return {
      status: \"sucesso\",
      veredito: result.value.veredito,
      timestamp,
    };
  }
}
