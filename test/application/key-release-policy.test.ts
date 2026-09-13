import { describe, expect, it } from "vitest";
import { evaluateKeyRelease } from "../../src/application/cofre/key-release-policy";

describe("política de liberação de chave", () => {
  const validRequest = {
    role: "executor" as const,
    executorId: "executor-001",
    expectedExecutorId: "executor-001",
    codeHash: "code-hash-001",
    expectedCodeHash: "code-hash-001",
    environmentAttested: true,
    packageHash: "package-hash-001",
    expectedPackageHash: "package-hash-001",
    requestId: "request-001",
    requestAlreadyUsed: false,
  };

  it("deve liberar somente quando todos os vínculos forem válidos", () => {
    expect(evaluateKeyRelease(validRequest)).toEqual({
      allowed: true,
      reason: "release-authorized",
    });
  });

  it("deve negar Administrador ou Operador", () => {
    expect(evaluateKeyRelease({ ...validRequest, role: "administrator" })).toEqual({
      allowed: false,
      reason: "role-forbidden",
    });
    expect(evaluateKeyRelease({ ...validRequest, role: "operator" })).toEqual({
      allowed: false,
      reason: "role-forbidden",
    });
  });

  it("deve negar vínculo divergente, ambiente não atestado ou replay", () => {
    expect(evaluateKeyRelease({ ...validRequest, codeHash: "code-hash-other" })).toEqual({
      allowed: false,
      reason: "code-mismatch",
    });
    expect(evaluateKeyRelease({ ...validRequest, environmentAttested: false })).toEqual({
      allowed: false,
      reason: "environment-not-attested",
    });
    expect(evaluateKeyRelease({ ...validRequest, requestAlreadyUsed: true })).toEqual({
      allowed: false,
      reason: "request-replay",
    });
  });
});
