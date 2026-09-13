export type RevocationInput = Readonly<{
  state: "ativo" | "revogado";
  version: string;
  curatorId: string;
  requestedBy: string;
  revokedAt: string;
}>;

export type RevocationResult = Readonly<
  | {
      state: "revogado";
      version: string;
      revokedBy: string;
      revokedAt: string;
    }
  | { state: "revogado"; version: string; reason: "curator-required" }
>;

export function revokePublishedVersion(input: RevocationInput): RevocationResult {
  if (input.state !== "ativo" || input.requestedBy !== input.curatorId) {
    return { state: "revogado", version: input.version, reason: "curator-required" };
  }

  return Object.freeze({
    state: "revogado",
    version: input.version,
    revokedBy: input.requestedBy,
    revokedAt: input.revokedAt,
  });
}

export function canExecuteVersion(state: "ativo" | "revogado"): boolean {
  return state === "ativo";
}
