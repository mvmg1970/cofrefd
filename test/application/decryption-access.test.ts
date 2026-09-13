import { describe, expect, it } from "vitest";
import { evaluateDecryptionAccess } from "../../src/application/cofre/decryption-access";

describe("acesso à descriptografia", () => {
  it("deve permitir somente executor autorizado", () => {
    expect(evaluateDecryptionAccess("executor")).toEqual({
      allowed: true,
      reason: "executor-authorized",
    });
  });

  it("deve negar Administrador e Operador", () => {
    expect(evaluateDecryptionAccess("administrator")).toEqual({
      allowed: false,
      reason: "role-forbidden",
    });
    expect(evaluateDecryptionAccess("operator")).toEqual({
      allowed: false,
      reason: "role-forbidden",
    });
  });
});
