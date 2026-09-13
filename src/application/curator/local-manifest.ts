import { createHash } from "node:crypto";
import type { DeclarativeFormat, Manifest } from "../../domain/contracts/protected-package";

type LocalManifestInput = Readonly<{
  content: string;
  version: string;
  format: DeclarativeFormat;
}>;

export function createLocalManifest(input: LocalManifestInput): Manifest {
  const contentHash = createHash("sha256")
    .update(input.content, "utf8")
    .digest("hex");

  return Object.freeze({
    version: input.version,
    contentHash: `sha256:${contentHash}`,
    format: input.format,
  });
}
