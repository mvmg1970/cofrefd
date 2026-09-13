export type KeyReleaseRequest = Readonly<{
  role: "executor" | "operator" | "administrator";
  executorId: string;
  expectedExecutorId: string;
  codeHash: string;
  expectedCodeHash: string;
  environmentAttested: boolean;
  packageHash: string;
  expectedPackageHash: string;
  requestId: string;
  requestAlreadyUsed: boolean;
}>;

export type KeyReleaseDecision = Readonly<{
  allowed: boolean;
  reason:
    | "release-authorized"
    | "role-forbidden"
    | "executor-mismatch"
    | "code-mismatch"
    | "environment-not-attested"
    | "package-mismatch"
    | "request-replay";
}>;

export function evaluateKeyRelease(input: KeyReleaseRequest): KeyReleaseDecision {
  if (input.role !== "executor") {
    return { allowed: false, reason: "role-forbidden" };
  }

  if (input.executorId !== input.expectedExecutorId) {
    return { allowed: false, reason: "executor-mismatch" };
  }

  if (input.codeHash !== input.expectedCodeHash) {
    return { allowed: false, reason: "code-mismatch" };
  }

  if (!input.environmentAttested) {
    return { allowed: false, reason: "environment-not-attested" };
  }

  if (input.packageHash !== input.expectedPackageHash) {
    return { allowed: false, reason: "package-mismatch" };
  }

  if (input.requestAlreadyUsed) {
    return { allowed: false, reason: "request-replay" };
  }

  return { allowed: true, reason: "release-authorized" };
}
