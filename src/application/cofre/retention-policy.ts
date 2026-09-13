export type RetentionInput = Readonly<{
  artifactType: "rejected-package" | "temporary-file";
  createdAt: number;
  now: number;
  legalHold: boolean;
  investigationActive: boolean;
}>;

export type RetentionDecision = Readonly<{
  delete: boolean;
  reason:
    | "retention-window-active"
    | "retention-window-expired"
    | "legal-retention"
    | "active-investigation";
}>;

export type QuarantineArtifact = Readonly<{
  id: string;
  artifactType: "rejected-package" | "temporary-file";
  createdAt: number;
}>;

const RETENTION_WINDOW_SECONDS = 24 * 60 * 60;

export function evaluateQuarantineRetention(
  input: RetentionInput,
): RetentionDecision {
  if (input.legalHold) {
    return { delete: false, reason: "legal-retention" };
  }

  if (input.investigationActive) {
    return { delete: false, reason: "active-investigation" };
  }

  if (input.now - input.createdAt < RETENTION_WINDOW_SECONDS) {
    return { delete: false, reason: "retention-window-active" };
  }

  return { delete: true, reason: "retention-window-expired" };
}

export function createInMemoryRetentionStore() {
  const artifacts = new Map<string, QuarantineArtifact>();

  return {
    add(artifact: QuarantineArtifact): void {
      artifacts.set(artifact.id, artifact);
    },
    has(id: string): boolean {
      return artifacts.has(id);
    },
    purge(
      id: string,
      now: number,
      legalHold: boolean,
      investigationActive: boolean,
    ): RetentionDecision {
      const artifact = artifacts.get(id);
      if (!artifact) {
        return { delete: false, reason: "retention-window-active" };
      }

      const decision = evaluateQuarantineRetention({
        artifactType: artifact.artifactType,
        createdAt: artifact.createdAt,
        now,
        legalHold,
        investigationActive,
      });
      if (decision.delete) {
        artifacts.delete(id);
      }
      return decision;
    },
  };
}
