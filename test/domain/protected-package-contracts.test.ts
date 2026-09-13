import { describe, expect, it } from "vitest";
import {
  createManifest,
  createProtectedPackage,
  transitionPackageState,
  type PackageState,
} from "../../src/domain/contracts/protected-package";

describe("contratos do pacote protegido", () => {
  it("deve criar manifesto sem carregar plaintext", () => {
    const manifest = createManifest({
      version: "1.0.0",
      contentHash: "hash-sintetico-001",
      format: "declarative-rules",
    });

    expect(manifest).toEqual({
      version: "1.0.0",
      contentHash: "hash-sintetico-001",
      format: "declarative-rules",
    });
    expect(manifest).not.toHaveProperty("plaintext");
  });

  it("deve criar pacote protegido somente com envelope opaco", () => {
    const manifest = createManifest({
      version: "1.0.0",
      contentHash: "hash-sintetico-001",
      format: "declarative-rules",
    });

    const protectedPackage = createProtectedPackage({
      manifest,
      ciphertext: "ciphertext-sintetico-001",
      signature: "signature-sintetica-001",
    });

    expect(protectedPackage.manifest).toEqual(manifest);
    expect(protectedPackage.ciphertext).toBe("ciphertext-sintetico-001");
    expect(protectedPackage.signature).toBe("signature-sintetica-001");
    expect(protectedPackage).not.toHaveProperty("plaintext");
  });

  it("deve permitir somente transições de estado válidas", () => {
    const validTransitions: Array<[PackageState, PackageState]> = [
      ["preparado-local", "protegido-local"],
      ["protegido-local", "recebido-em-quarentena"],
      ["recebido-em-quarentena", "validando"],
      ["validando", "pendente-aprovacao"],
      ["pendente-aprovacao", "aprovado"],
      ["aprovado", "publicado"],
      ["publicado", "ativo"],
      ["ativo", "revogado"],
    ];

    for (const [from, to] of validTransitions) {
      expect(transitionPackageState(from, to)).toBe(true);
    }

    expect(transitionPackageState("recebido-em-quarentena", "publicado")).toBe(false);
    expect(transitionPackageState("revogado", "ativo")).toBe(false);
  });
});
