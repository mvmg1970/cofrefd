import { describe, expect, it } from "vitest";
import { publishApprovedPackage } from "../../src/application/cofre/publication";
import {
  createSyntheticProtectionKeys,
  protectForTransmission,
} from "../../src/application/curator/local-protection";
import { createLocalManifest } from "../../src/application/curator/local-manifest";

describe("publicação versionada", () => {
  it("deve publicar somente pacote aprovado com versão e hash", () => {
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

    const published = publishApprovedPackage({
      state: "aprovado",
      envelope,
      publishedAt: "2026-09-10T12:00:00.000Z",
    });

    expect(published).toMatchObject({
      state: "publicado",
      version: "1.0.0",
      contentHash: envelope.manifest.contentHash,
    });
    expect(Object.isFrozen(published)).toBe(true);
  });

  it("deve rejeitar publicação de pacote ainda pendente", () => {
    const result = publishApprovedPackage({
      state: "pendente-aprovacao",
      envelope: {} as never,
      publishedAt: "2026-09-10T12:00:00.000Z",
    });

    expect(result).toEqual({ state: "rejeitado", reason: "approval-required" });
  });
});
