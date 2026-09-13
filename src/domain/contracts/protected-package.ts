export type DeclarativeFormat =
  | "declarative-config"
  | "declarative-rules"
  | "declarative-knowledge";

export type PackageState =
  | "preparado-local"
  | "protegido-local"
  | "recebido-em-quarentena"
  | "validando"
  | "rejeitado"
  | "pendente-aprovacao"
  | "aprovado"
  | "publicado"
  | "ativo"
  | "revogado";

export type Manifest = Readonly<{
  version: string;
  contentHash: string;
  format: DeclarativeFormat;
}>;

export type ProtectedPackage = Readonly<{
  manifest: Manifest;
  ciphertext: string;
  signature: string;
}>;

type ManifestInput = {
  version: string;
  contentHash: string;
  format: DeclarativeFormat;
};

type ProtectedPackageInput = {
  manifest: Manifest;
  ciphertext: string;
  signature: string;
};

export function createManifest(input: ManifestInput): Manifest {
  return Object.freeze({ ...input });
}

export function createProtectedPackage(input: ProtectedPackageInput): ProtectedPackage {
  return Object.freeze({
    manifest: input.manifest,
    ciphertext: input.ciphertext,
    signature: input.signature,
  });
}

const transitions: Readonly<Record<PackageState, readonly PackageState[]>> = {
  "preparado-local": ["protegido-local"],
  "protegido-local": ["recebido-em-quarentena"],
  "recebido-em-quarentena": ["validando"],
  validando: ["rejeitado", "pendente-aprovacao"],
  rejeitado: [],
  "pendente-aprovacao": ["aprovado"],
  aprovado: ["publicado"],
  publicado: ["ativo"],
  ativo: ["revogado"],
  revogado: [],
};

export function transitionPackageState(from: PackageState, to: PackageState): boolean {
  return transitions[from].includes(to);
}
