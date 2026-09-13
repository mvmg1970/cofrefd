export type ExecutorProfile = Readonly<{
  attested: boolean;
  networkEnabled: boolean;
  filesystem: "ephemeral" | "persistent";
  memoryMb: number;
  cpuLimit: number;
  timeoutMs: number;
}>;

export type ExecutorResult = Readonly<
  | { executed: true; result: "synthetic-verdict" }
  | {
      executed: false;
      reason:
        | "executor-not-authorized"
        | "network-not-allowed"
        | "filesystem-not-ephemeral"
        | "executor-limits-exceeded";
    }
>;

export function createSyntheticExecutor(profile: ExecutorProfile): ExecutorProfile {
  return Object.freeze({ ...profile });
}

export function executeInExecutor(
  executor: ExecutorProfile,
  operation: string,
): ExecutorResult {
  void operation;

  if (!executor.attested) {
    return { executed: false, reason: "executor-not-authorized" };
  }

  if (executor.networkEnabled) {
    return { executed: false, reason: "network-not-allowed" };
  }

  if (executor.filesystem !== "ephemeral") {
    return { executed: false, reason: "filesystem-not-ephemeral" };
  }

  if (executor.memoryMb > 128 || executor.cpuLimit > 1 || executor.timeoutMs > 30_000) {
    return { executed: false, reason: "executor-limits-exceeded" };
  }

  return { executed: true, result: "synthetic-verdict" };
}
