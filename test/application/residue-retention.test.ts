import { describe, expect, it } from "vitest";
import { evaluateLifecycleRetention } from "../../src/application/cofre/residue-retention";

describe("retenção de cópias e resíduos", () => {
  it("deve aplicar os prazos às cópias do pacote", () => {
    expect(
      evaluateLifecycleRetention({
        artifactType: "backup",
        lifecycle: "ativo",
        ageHours: 8_760,
        executionFinished: false,
        legalHold: false,
        investigationActive: false,
      }),
    ).toEqual({ retain: true, reason: "active-until-revocation" });

    expect(
      evaluateLifecycleRetention({
        artifactType: "snapshot",
        lifecycle: "historico",
        ageHours: 2_160,
        executionFinished: false,
        legalHold: false,
        investigationActive: false,
      }),
    ).toEqual({ retain: false, reason: "historical-retention-expired" });

    expect(
      evaluateLifecycleRetention({
        artifactType: "replica",
        lifecycle: "rejeitado",
        ageHours: 25,
        executionFinished: false,
        legalHold: false,
        investigationActive: false,
      }),
    ).toEqual({ retain: false, reason: "temporary-retention-expired" });
  });

  it("deve descartar resíduos finalizados imediatamente", () => {
    for (const artifactType of ["volatile-memory", "temporary-key", "execution-residue"] as const) {
      expect(
        evaluateLifecycleRetention({
          artifactType,
          lifecycle: "temporario",
          ageHours: 0,
          executionFinished: true,
          legalHold: false,
          investigationActive: false,
        }),
      ).toEqual({ retain: false, reason: "immediate-discard" });
    }
  });

  it("deve preservar qualquer artefato sob exceção formal", () => {
    expect(
      evaluateLifecycleRetention({
        artifactType: "backup",
        lifecycle: "rejeitado",
        ageHours: 10_000,
        executionFinished: true,
        legalHold: true,
        investigationActive: false,
      }),
    ).toEqual({ retain: true, reason: "legal-retention" });
  });
});
