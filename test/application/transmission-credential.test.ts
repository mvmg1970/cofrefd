import { describe, expect, it } from "vitest";
import {
  consumeTransmissionCredential,
  issueTransmissionCredential,
  verifyTransmissionCredential,
} from "../../src/application/curator/transmission-credential";

describe("credencial temporária de transmissão", () => {
  it("deve ser válida somente durante o prazo e para o destino aprovado", () => {
    const credential = issueTransmissionCredential({
      clientId: "curador-client-001",
      destination: "cofre-sandbox",
      issuedAt: 1_000,
      ttlSeconds: 60,
    });

    expect(verifyTransmissionCredential(credential, "cofre-sandbox", 1_030)).toEqual({
      valid: true,
      reason: "valid-credential",
    });
    expect(verifyTransmissionCredential(credential, "cofre-sandbox", 1_061)).toEqual({
      valid: false,
      reason: "expired-credential",
    });
    expect(verifyTransmissionCredential(credential, "servico-publico", 1_030)).toEqual({
      valid: false,
      reason: "untrusted-destination",
    });
  });

  it("deve impedir a reutilização da mesma credencial", () => {
    const credential = issueTransmissionCredential({
      clientId: "curador-client-001",
      destination: "cofre-sandbox",
      issuedAt: 1_000,
      ttlSeconds: 60,
    });

    expect(consumeTransmissionCredential(credential.tokenId)).toBe(true);
    expect(consumeTransmissionCredential(credential.tokenId)).toBe(false);
  });
});
