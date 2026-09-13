import { describe, expect, it } from "vitest";
import {
  createSyntheticProtectionKeys,
  protectForTransmission,
  verifyProtectedEnvelope,
} from "../../src/application/curator/local-protection";
import { createLocalManifest } from "../../src/application/curator/local-manifest";

describe("proteção local antes da transmissão", () => {
  it("deve cifrar o conteúdo e assinar o envelope", () => {
    const keys = createSyntheticProtectionKeys();
    const content = "regra-sintetica-confidencial";
    const manifest = createLocalManifest({
      content,
      version: "1.0.0",
      format: "declarative-rules",
    });

    const envelope = protectForTransmission({ content, manifest, keys });

    expect(envelope.ciphertext).not.toContain(content);
    expect(envelope.ciphertext).not.toBe("");
    expect(envelope.signature).not.toBe("");
    expect(envelope.iv).toMatch(/^[a-f0-9]{24}$/);
    expect(envelope.encryptedSessionKey).not.toBe("");
    expect(verifyProtectedEnvelope(envelope, keys.signingPublicKey)).toBe(true);
    expect(envelope).not.toHaveProperty("plaintext");
    expect(envelope).not.toHaveProperty("content");
  });

  it("deve rejeitar envelope alterado depois da assinatura", () => {
    const keys = createSyntheticProtectionKeys();
    const content = "regra-sintetica-confidencial";
    const manifest = createLocalManifest({
      content,
      version: "1.0.0",
      format: "declarative-rules",
    });
    const envelope = protectForTransmission({ content, manifest, keys });

    expect(
      verifyProtectedEnvelope(
        { ...envelope, ciphertext: `${envelope.ciphertext}00` },
        keys.signingPublicKey,
      ),
    ).toBe(false);
  });
});
