import { createStore } from "zustand/vanilla";
import type { ProcessarAtivoUseCase, ProcessarAtivoOutput } from "../../domain/usecases/processar-ativo";
import type { AtivoRepository } from "../../domain/repositories/ativo-repository";
import type { ProcessamentoFailure } from "../../domain/failures/processamento-failure";

export type SandboxStoreState = {
  readonly loading: boolean;
  readonly lastError: string | null;
  readonly logs: ReadonlyArray<string>;
  readonly resultadoProcessamento: ProcessarAtivoOutput | null;
  
  processarAtivo: (referenciaOpaca: string, assinaturaValidacao: string) => Promise<boolean>;
  limparLogs: () => void;
};

const messageFor = (failure: ProcessamentoFailure): string => {
  switch (failure.kind) {
    case "ativo-nao-encontrado":
      return "Ativo lógico protegido não foi encontrado na sandbox.";
    case "assinatura-invalida":
      return "Falha de segurança: Assinatura inválida ou corrompida.";
    case "risco-exfiltracao-detectado":
      return "Alerta crítico: Tentativa de exfiltração de dados detectada e contida.";
  }
};

/**
 * Store da apresentação (Zustand) para controle da Sandbox do cofre.
 * 
 * Orquestra as solicitações do FD-Core em direção ao executor efêmero,
 * garantindo o mapeamento de falhas estruturadas para o painel de visualização.
 */
export const createSandboxStore = (
  processarAtivo: ProcessarAtivoUseCase,
  repository: AtivoRepository
) => {
  return createStore<SandboxStoreState>((set) => ({
    loading: false,
    lastError: null,
    logs: [],
    resultadoProcessamento: null,

    processarAtivo: async (referenciaOpaca, assinaturaValidacao) => {
      set((state) => ({
        loading: true,
        lastError: null,
        resultadoProcessamento: null,
        logs: [...state.logs, `Solicitando processamento de ativo com referência: ${referenciaOpaca}...`]
      }));

      const result = await processarAtivo.executar({
        referenciaOpaca,
        assinaturaValidacao,
      });

      if (result.kind === "failure") {
        const errorMsg = messageFor(result.error);
        set((state) => ({
          loading: false,
          lastError: errorMsg,
          logs: [...state.logs, `Erro no processamento: ${result.error.kind}`]
        }));
        return false;
      }

      set((state) => ({
        loading: false,
        resultadoProcessamento: result.value,
        logs: [...state.logs, `Processamento autorizado com sucesso. Veredito: ${result.value.veredito}`]
      }));
      return true;
    },

    limparLogs: () => set({ logs: [] })
  }));
};
