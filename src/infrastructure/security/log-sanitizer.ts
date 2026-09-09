/**
 * Remove valores protegidos de uma mensagem antes que ela alcance um logger.
 *
 * A substituição usa operações literais, evitando que o conteúdo protegido seja
 * interpretado como uma expressão regular. Valores vazios são ignorados para
 * não transformar uma mensagem inteira em marcadores de redação.
 */
export const sanitizeLogMessage = (
  message: string,
  protectedValues: readonly string[],
): string => {
  return [...new Set(protectedValues)]
    .filter((value) => value.length > 0)
    .sort((left, right) => right.length - left.length)
    .reduce(
      (sanitized, protectedValue) => sanitized.split(protectedValue).join("[REDACTED]"),
      message,
    );
};
