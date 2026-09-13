import { describe, expect, it } from "vitest";
import {
  verifyTrustedClient,
  type TrustedClientEnvelope,
} from "../../src/domain/contracts/trusted-client-contract";

describe("contrato do cliente local confiável", () => {
  const validEnvelope: TrustedClientEnvelope = {
    clientId: "curador-client-001",
    clientVersion: "1.0.0",
    clientHash: "hash-cliente-sintetico-001",
    signature: "assinatura-cliente-sintetica-001",
    destination: "cofre-sandbox",
    issuedAt: "2026-09-10T12:00:00.000Z",
  };

  it("deve aceitar cliente assinado, versionado e destinado ao Cofre", () => {
    expect(verifyTrustedClient(validEnvelope)).toEqual({
      trusted: true,
      reason: "trusted-client",
    });
  });

  it("deve rejeitar cliente sem assinatura ou hash verificável", () => {
    expect(
      verifyTrustedClient({ ...validEnvelope, signature: "" }),
    ).toEqual({ trusted: false, reason: "invalid-client-integrity" });
    expect(
      verifyTrustedClient({ ...validEnvelope, clientHash: "" }),
    ).toEqual({ trusted: false, reason: "invalid-client-integrity" });
  });

  it("deve rejeitar versão ou destino não aprovados", () => {
    expect(
      verifyTrustedClient({ ...validEnvelope, clientVersion: "0.0.0" }),
    ).toEqual({ trusted: false, reason: "untrusted-client-version" });
    expect(
      verifyTrustedClient({ ...validEnvelope, destination: "servico-publico" }),
    ).toEqual({ trusted: false, reason: "untrusted-destination" });
  });
});
