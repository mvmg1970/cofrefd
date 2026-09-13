export type LifecycleArtifactType =
  | "backup"
  | "replica"
  | "snapshot"
  | "volatile-memory"
  | "temporary-key"
  | "execution-residue";

export type LifecycleState = "ativo" | "historico" | "rejeitado" | "temporario";

export type LifecycleRetentionInput = Readonly<{
  artifactType: LifecycleArtifactType;
  lifecycle: LifecycleState;
  ageHours: number;
  executionFinished: boolean;
  legalHold: boolean;
  investigationActive: boolean;
}>;

export type LifecycleRetentionDecision = Readonly<{
  retain: boolean;
  reason:
    | "active-until-revocation"
    | "historical-retention-active"
    | "historical-retention-expired"
    | "temporary-retention-active"
    | "temporary-retention-expired"
    | "immediate-discard"
    | "legal-retention"
    | "active-investigation";
}>;

const HISTORICAL_RETENTION_HOURS = 90 * 24;
const TEMPORARY_RETENTION_HOURS = 24;

export function evaluateLifecycleRetention(
  input: LifecycleRetentionInput,
): LifecycleRetentionDecision {
  if (input.legalHold) {
    return { retain: true, reason: "legal-retention" };
  }

  if (input.investigationActive) {
    return { retain: true, reason: "active-investigation" };
  }

  if (
    input.executionFinished &&
    ["volatile-memory", "temporary-key", "execution-residue"].includes(input.artifactType)
  ) {
    return { retain: false, reason: "immediate-discard" };
  }

  if (input.lifecycle === "ativo") {
    return { retain: true, reason: "active-until-revocation" };
  }

  if (input.lifecycle === "historico") {
    return input.ageHours < HISTORICAL_RETENTION_HOURS
      ? { retain: true, reason: "historical-retention-active" }
      : { retain: false, reason: "historical-retention-expired" };
  }

  return input.ageHours < TEMPORARY_RETENTION_HOURS
    ? { retain: true, reason: "temporary-retention-active" }
    : { retain: false, reason: "temporary-retention-expired" };
}
