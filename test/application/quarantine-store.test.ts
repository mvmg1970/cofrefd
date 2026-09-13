import { describe, expect, it } from "vitest";
import { createQuarantineRecord } from "../../src/application/cofre/quarantine-store";
import {
  createSyntheticProtectionKeys,
  protectForTransmission,
} from "../../src/application/curator/local-protection";
import { createLocalManifest } from "../../src/application/curator/local-manifest";
import { receiveProtectedPackage } from "../../src/application/cofre/quarantine-gateway";

describe("armazenamento em quarentena", () => {
  it("deve guardar o envelope protegido com metadados mínimos", () => {
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

    if (receipt.state !== "recebido-em-quarentena") {
      throw new Error("pacote deveria ter sido recebido em quarentena");
    }

    const record = createQuarantineRecord(receipt, "2026-09-10T12:00:00.000Z");

    expect(record.state).toBe("recebido-em-quarentena");
    expect(record.envelope).toEqual(envelope);
    expect(record.metadata).toEqual({
      contentHash: envelope.manifest.contentHash,
      format: envelope.manifest.format,
      version: envelope.manifest.version,
      receivedAt: "2026-09-10T12:00:00.000Z",
    });
    expect(record.metadata).not.toHaveProperty("content");
    expect(record.metadata).not.toHaveProperty("plaintext");
    expect(record.metadata).not.toHaveProperty("path");
  });
});
