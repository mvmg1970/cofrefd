import { describe, expect, it } from "vitest";
import { approvePackage } from "../../src/application/cofre/approval-gate";

describe("gate de aprovação humana", () => {
  it("deve aprovar explicitamente um pacote pendente", () => {
    expect(
      approvePackage({
        state: "pendente-aprovacao",
        approverId: "curador-001",
        environment: "sandbox-sintetica",
      }),
    ).toEqual({ state: "aprovado", approvedBy: "curador-001" });
  });

  it("não deve aprovar pacote rejeitado ou publicar automaticamente", () => {
    expect(
      approvePackage({
        state: "rejeitado",
        approverId: "curador-001",
        environment: "sandbox-sintetica",
      }),
    ).toEqual({ state: "rejeitado", reason: "package-not-pending" });
  });
});
