/**
 * Falhas previsíveis mapeadas durante o ciclo de processamento do cofre.
 */
export type ProcessamentoFailure =
  | { readonly kind: "ativo-nao-encontrado" }
  | { readonly kind: "assinatura-invalida" }
  | { readonly kind: "risco-exfiltracao-detectado" };
