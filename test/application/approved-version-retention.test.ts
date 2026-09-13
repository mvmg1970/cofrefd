import { describe, expect, it } from "vitest";
import { evaluateApprovedVersionRetention } from "../../src/application/cofre/approved-version-retention";

describe("retenção de versões aprovadas", () => {
  it("deve manter a versão ativa até revogação", () => {
    expect(
      evaluateApprovedVersionRetention({ state: "ativo", ageDays: 365 }),
    ).toEqual({ retain: true, reason: "active-until-revocation" });
  });

  it("deve manter histórico por 90 dias e expirar depois", () => {
    expect(
      evaluateApprovedVersionRetention({ state: "historico", ageDays: 89 }),
    ).toEqual({ retain: true, reason: "historical-retention-active" });
    expect(
      evaluateApprovedVersionRetention({ state: "historico", ageDays: 90 }),
    ).toEqual({ retain: false, reason: "historical-retention-expired" });
  });
});
