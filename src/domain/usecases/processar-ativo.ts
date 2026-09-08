import type { Result } from "../result";
import { success, failure } from "../result";
import type { AtivoRepository } from "../repositories/ativo-repository";
import type { ProcessamentoFailure } from "../failures/processamento-failure";

export type ProcessarAtivoInput = {
  readonly referenciaOpaca: string;
  readonly assinaturaValidacao: string;
};

export type ProcessarAtivoOutput = {
  readonly veredito: "autorizado" | "negado";
  readonly timestampExecucao: string;
};

export type ProcessarAtivo = (
  input: ProcessarAtivoInput
) => Promise<Result<ProcessarAtivoOutput, ProcessamentoFailure>>;

/**
 * Factory que constrói o caso de uso de processamento de ativo.
 * 
 * Este usecase reside puramente na camada de domínio (TypeScript puro) e executa
 * a lógica isolada de segurança do cofre, validando assinaturas e recuperando 
 * ativos através da porta AtivoRepository de forma totalmente independente de infraestrutura.
 */
export const makeProcessarAtivo = (repository: AtivoRepository): ProcessarAtivo => {
  return async ({ referenciaOpaca, assinaturaValidacao }) => {
    const ativo = await repository.buscarPorReferencia(referenciaOpaca);

    if (!ativo) {
      return failure({ kind: "ativo-nao-encontrado" });
    }

    // Regra de validação sintética para a sandbox (Gate 0)
    // Uma assinatura é considerada válida se começar com o prefixo 'ASSINATURA_VALIDA_'
    const assinaturaEhValida = assinaturaValidacao.startsWith("ASSINATURA_VALIDA_");

    if (!assinaturaEhValida) {
      return failure({ kind: "assinatura-invalida" });
    }

    return success({
      veredito: "autorizado",
      timestampExecucao: new Date().toISOString(),
    });
  };
};
