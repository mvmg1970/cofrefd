export type ApprovedVersionRetentionInput = Readonly<{
  state: "ativo" | "historico";
  ageDays: number;
}>;

export type ApprovedVersionRetentionDecision = Readonly<{
  retain: boolean;
  reason:
    | "active-until-revocation"
    | "historical-retention-active"
    | "historical-retention-expired";
}>;

const HISTORICAL_RETENTION_DAYS = 90;

export function evaluateApprovedVersionRetention(
  input: ApprovedVersionRetentionInput,
): ApprovedVersionRetentionDecision {
  if (input.state === "ativo") {
    return { retain: true, reason: "active-until-revocation" };
  }

  return input.ageDays < HISTORICAL_RETENTION_DAYS
    ? { retain: true, reason: "historical-retention-active" }
    : { retain: false, reason: "historical-retention-expired" };
}
