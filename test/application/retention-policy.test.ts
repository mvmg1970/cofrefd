import { describe, expect, it } from "vitest";
import {
  createInMemoryRetentionStore,
  evaluateQuarantineRetention,
} from "../../src/application/cofre/retention-policy";

describe("política de retenção de quarentena", () => {
  it("deve solicitar exclusão após 24 horas", () => {
    expect(
      evaluateQuarantineRetention({
        artifactType: "rejected-package",
        createdAt: 1_000,
        now: 87_401,
        legalHold: false,
        investigationActive: false,
      }),
    ).toEqual({ delete: true, reason: "retention-window-expired" });

    expect(
      evaluateQuarantineRetention({
        artifactType: "temporary-file",
        createdAt: 1_000,
        now: 87_401,
        legalHold: false,
        investigationActive: false,
      }),
    ).toEqual({ delete: true, reason: "retention-window-expired" });
  });

  it("deve preservar artefato sob retenção legal ou investigação ativa", () => {
    expect(
      evaluateQuarantineRetention({
        artifactType: "rejected-package",
        createdAt: 1_000,
        now: 100_000,
        legalHold: true,
        investigationActive: false,
      }),
    ).toEqual({ delete: false, reason: "legal-retention" });

    expect(
      evaluateQuarantineRetention({
        artifactType: "temporary-file",
        createdAt: 1_000,
        now: 100_000,
        legalHold: false,
        investigationActive: true,
      }),
    ).toEqual({ delete: false, reason: "active-investigation" });
  });

  it("deve remover artefato expirado e preservar artefato sob exceção", () => {
    const store = createInMemoryRetentionStore();
    store.add({ id: "rejeitado-001", artifactType: "rejected-package", createdAt: 1_000 });
    store.add({ id: "temporario-001", artifactType: "temporary-file", createdAt: 1_000 });

    expect(store.purge("rejeitado-001", 87_401, false, false)).toEqual({
      delete: true,
      reason: "retention-window-expired",
    });
    expect(store.has("rejeitado-001")).toBe(false);
    expect(store.purge("temporario-001", 87_401, true, false)).toEqual({
      delete: false,
      reason: "legal-retention",
    });
    expect(store.has("temporario-001")).toBe(true);
  });
});
