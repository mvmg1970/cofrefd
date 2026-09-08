/**
 * Resultado explícito de uma operação que pode falhar de forma previsível.
 * 
 * Erro como valor (Constituição, Princípio III): em vez de lançar exceções genéricas (throw) 
 * que possam vazar metadados entre as camadas, a operação retorna um objeto do tipo `Result` 
 * contendo ou um valor de sucesso ou uma falha estritamente tipada.
 * A união discriminada pelo campo `kind` força o tratamento exaustivo dos fluxos no TypeScript.
 */
export type Result<S, F> =
  | { readonly kind: "success"; readonly value: S }
  | { readonly kind: "failure"; readonly error: F };

export const success = <S, F>(value: S): Result<S, F> => ({
  kind: "success",
  value,
});

export const failure = <S, F>(error: F): Result<S, F> => ({
  kind: "failure",
  error,
});
