import { describe, expect, it } from "vitest";
import {
  canExecuteVersion,
  revokePublishedVersion,
} from "../../src/application/cofre/revocation";

describe("revogação de versão publicada", () => {
  it("deve permitir revogação direta pelo Curador", () => {
    expect(
      revokePublishedVersion({
        state: "ativo",
        version: "1.0.0",
        curatorId: "curador-001",
        requestedBy: "curador-001",
        revokedAt: "2026-09-10T12:00:00.000Z",
      }),
    ).toEqual({
      state: "revogado",
      version: "1.0.0",
      revokedBy: "curador-001",
      revokedAt: "2026-09-10T12:00:00.000Z",
    });
  });

  it("deve bloquear execução de versão revogada", () => {
    expect(canExecuteVersion("ativo")).toBe(true);
    expect(canExecuteVersion("revogado")).toBe(false);
  });
});
