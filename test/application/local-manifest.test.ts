import { describe, expect, it } from "vitest";
import { createLocalManifest } from "../../src/application/curator/local-manifest";

describe("manifesto local do Curador", () => {
  it("deve gerar versão, formato e hash sem transportar o conteúdo", () => {
    const content = "regra-sintetica-confidencial";
    const manifest = createLocalManifest({
      content,
      version: "1.0.0",
      format: "declarative-rules",
    });

    expect(manifest.version).toBe("1.0.0");
    expect(manifest.format).toBe("declarative-rules");
    expect(manifest.contentHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(manifest).not.toHaveProperty("content");
    expect(manifest).not.toHaveProperty("plaintext");
  });

  it("deve gerar o mesmo hash para o mesmo conteúdo", () => {
    const input = {
      content: "regra-sintetica-confidencial",
      version: "1.0.0",
      format: "declarative-rules" as const,
    };

    expect(createLocalManifest(input).contentHash).toBe(
      createLocalManifest(input).contentHash,
    );
  });
});
