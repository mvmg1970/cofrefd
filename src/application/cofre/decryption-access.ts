export type DecryptionRole = "executor" | "operator" | "administrator";

export type DecryptionAccessDecision = Readonly<{
  allowed: boolean;
  reason: "executor-authorized" | "role-forbidden";
}>;

export function evaluateDecryptionAccess(
  role: DecryptionRole,
): DecryptionAccessDecision {
  return role === "executor"
    ? { allowed: true, reason: "executor-authorized" }
    : { allowed: false, reason: "role-forbidden" };
}
