import { describe, expect, it } from "vitest";
import { evaluateExecutionBinding } from "../../src/application/cofre/execution-binding";

describe("vínculo de execução aprovada", () => {
  const validBinding = {
    codeHash: "code-001",
    expectedCodeHash: "code-001",
    imageHash: "image-001",
    expectedImageHash: "image-001",
    environmentHash: "environment-001",
    expectedEnvironmentHash: "environment-001",
  };

  it("deve autorizar vínculo íntegro", () => {
    expect(evaluateExecutionBinding(validBinding)).toEqual({
      valid: true,
      reason: "execution-binding-valid",
    });
  });

  it("deve invalidar alteração de código, imagem ou ambiente", () => {
    expect(evaluateExecutionBinding({ ...validBinding, codeHash: "code-other" })).toEqual({
      valid: false,
      reason: "code-changed",
    });
    expect(evaluateExecutionBinding({ ...validBinding, imageHash: "image-other" })).toEqual({
      valid: false,
      reason: "image-changed",
    });
    expect(
      evaluateExecutionBinding({ ...validBinding, environmentHash: "environment-other" }),
    ).toEqual({ valid: false, reason: "environment-changed" });
  });
});
