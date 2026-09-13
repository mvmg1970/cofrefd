import { describe, expect, it } from "vitest";
import { createLocalManifest } from "../../src/application/curator/local-manifest";
import {
  createSyntheticProtectionKeys,
  protectForTransmission,
} from "../../src/application/curator/local-protection";
import { validateProtectedPackage } from "../../src/application/cofre/protected-package-validator";

describe("validador isolado do pacote protegido", () => {
  it("deve validar formato, assinatura, versão e proveniência", () => {
    const keys = createSyntheticProtectionKeys();
    const content = "regra-sintetica-confidencial";
    const envelope = protectForTransmission({
      content,
      manifest: createLocalManifest({
        content,
        version: "1.0.0",
        format: "declarative-rules",
      }),
      keys,
    });

    expect(
      validateProtectedPackage({
        envelope,
        signingPublicKey: keys.signingPublicKey,
        clientId: "curador-client-001",
        expectedClientId: "curador-client-001",
      }),
    ).toEqual({ valid: true, reason: "valid-protected-package" });
  });

  it("deve rejeitar assinatura ou integridade inválida", () => {
    const keys = createSyntheticProtectionKeys();
    const content = "regra-sintetica-confidencial";
    const envelope = protectForTransmission({
      content,
      manifest: createLocalManifest({
        content,
        version: "1.0.0",
        format: "declarative-rules",
      }),
      keys,
    });

    expect(
      validateProtectedPackage({
        envelope: { ...envelope, ciphertext: `${envelope.ciphertext}00` },
        signingPublicKey: keys.signingPublicKey,
        clientId: "curador-client-001",
        expectedClientId: "curador-client-001",
      }),
    ).toEqual({ valid: false, reason: "invalid-signature" });
  });

  it("deve rejeitar proveniência ou formato não permitido", () => {
    const keys = createSyntheticProtectionKeys();
    const content = "regra-sintetica-confidencial";
    const envelope = protectForTransmission({
      content,
      manifest: createLocalManifest({
        content,
        version: "1.0.0",
        format: "declarative-rules",
      }),
      keys,
    });

    expect(
      validateProtectedPackage({
        envelope,
        signingPublicKey: keys.signingPublicKey,
        clientId: "cliente-desconhecido",
        expectedClientId: "curador-client-001",
      }),
    ).toEqual({ valid: false, reason: "untrusted-provenance" });

    expect(
      validateProtectedPackage({
        envelope: {
          ...envelope,
          manifest: { ...envelope.manifest, format: "script" as never },
        },
        signingPublicKey: keys.signingPublicKey,
        clientId: "curador-client-001",
        expectedClientId: "curador-client-001",
      }),
    ).toEqual({ valid: false, reason: "forbidden-format" });
  });
});
