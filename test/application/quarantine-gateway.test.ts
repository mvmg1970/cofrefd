import { describe, expect, it } from "vitest";
import { receiveProtectedPackage } from "../../src/application/cofre/quarantine-gateway";
import {
  createSyntheticProtectionKeys,
  protectForTransmission,
} from "../../src/application/curator/local-protection";
import { createLocalManifest } from "../../src/application/curator/local-manifest";

describe("gateway de entrada e quarentena", () => {
  it("deve receber o envelope protegido sem descriptografar", () => {
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

    const receipt = receiveProtectedPackage(envelope);

    expect(receipt.state).toBe("recebido-em-quarentena");
    if (receipt.state !== "recebido-em-quarentena") {
      throw new Error("envelope deveria ter sido recebido em quarentena");
    }
    expect(receipt.envelope).toEqual(envelope);
    expect(receipt).not.toHaveProperty("plaintext");
    expect(receipt).not.toHaveProperty("content");
  });

  it("deve rejeitar entrada que tente enviar conteúdo em claro", () => {
    const result = receiveProtectedPackage({ content: "plaintext proibido" });

    expect(result).toEqual({
      state: "rejeitado",
      reason: "plaintext-received",
    });
  });
});
