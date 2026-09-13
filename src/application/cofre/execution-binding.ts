export type ExecutionBinding = Readonly<{
  codeHash: string;
  expectedCodeHash: string;
  imageHash: string;
  expectedImageHash: string;
  environmentHash: string;
  expectedEnvironmentHash: string;
}>;

export type ExecutionBindingDecision = Readonly<{
  valid: boolean;
  reason:
    | "execution-binding-valid"
    | "code-changed"
    | "image-changed"
    | "environment-changed";
}>;

export function evaluateExecutionBinding(
  input: ExecutionBinding,
): ExecutionBindingDecision {
  if (input.codeHash !== input.expectedCodeHash) {
    return { valid: false, reason: "code-changed" };
  }

  if (input.imageHash !== input.expectedImageHash) {
    return { valid: false, reason: "image-changed" };
  }

  if (input.environmentHash !== input.expectedEnvironmentHash) {
    return { valid: false, reason: "environment-changed" };
  }

  return { valid: true, reason: "execution-binding-valid" };
}
