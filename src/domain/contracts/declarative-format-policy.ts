import type { DeclarativeFormat } from "./protected-package";

export type FormatValidation = Readonly<{
  allowed: boolean;
  reason: "allowed-declarative-format" | "forbidden-format";
}>;

const allowedFormats: ReadonlySet<DeclarativeFormat> = new Set([
  "declarative-config",
  "declarative-rules",
  "declarative-knowledge",
]);

export function isAllowedDeclarativeFormat(value: string): value is DeclarativeFormat {
  return allowedFormats.has(value as DeclarativeFormat);
}

export function validateDeclarativeFormat(value: string): FormatValidation {
  return isAllowedDeclarativeFormat(value)
    ? { allowed: true, reason: "allowed-declarative-format" }
    : { allowed: false, reason: "forbidden-format" };
}
