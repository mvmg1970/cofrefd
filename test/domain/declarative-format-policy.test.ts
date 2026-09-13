import { describe, expect, it } from "vitest";
import {
  isAllowedDeclarativeFormat,
  validateDeclarativeFormat,
} from "../../src/domain/contracts/declarative-format-policy";

describe("política de formatos declarativos", () => {
  it("deve aceitar somente configuração, regras e conhecimento versionado", () => {
    expect(isAllowedDeclarativeFormat("declarative-config")).toBe(true);
    expect(isAllowedDeclarativeFormat("declarative-rules")).toBe(true);
    expect(isAllowedDeclarativeFormat("declarative-knowledge")).toBe(true);
  });

  it("deve rejeitar formatos executáveis ou portadores de credenciais", () => {
    expect(isAllowedDeclarativeFormat("script")).toBe(false);
    expect(isAllowedDeclarativeFormat("binary")).toBe(false);
    expect(isAllowedDeclarativeFormat("macro")).toBe(false);
    expect(isAllowedDeclarativeFormat("library")).toBe(false);
    expect(isAllowedDeclarativeFormat("executable")).toBe(false);
    expect(isAllowedDeclarativeFormat("permanent-credential")).toBe(false);
  });

  it("deve retornar uma decisão tipada para o formato recebido", () => {
    expect(validateDeclarativeFormat("declarative-rules")).toEqual({
      allowed: true,
      reason: "allowed-declarative-format",
    });
    expect(validateDeclarativeFormat("script")).toEqual({
      allowed: false,
      reason: "forbidden-format",
    });
  });
});
