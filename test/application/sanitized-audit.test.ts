import { describe, expect, it } from "vitest";
import { createSanitizedAuditEvent } from "../../src/application/cofre/sanitized-audit";

describe("auditoria sanitizada", () => {
  it("deve registrar evento operacional sem conteúdo protegido", () => {
    const event = createSanitizedAuditEvent({
      actor: "curador-001",
      action: "approval",
      version: "1.0.0",
      contentHash: "sha256:hash-001",
      timestamp: "2026-09-10T12:00:00.000Z",
      plaintext: "segredo proibido",
      key: "chave proibida",
      path: "C:\\segredo\\arquivo.txt",
    });

    expect(event).toEqual({
      actor: "curador-001",
      action: "approval",
      version: "1.0.0",
      contentHash: "sha256:hash-001",
      timestamp: "2026-09-10T12:00:00.000Z",
    });
    expect(event).not.toHaveProperty("plaintext");
    expect(event).not.toHaveProperty("key");
    expect(event).not.toHaveProperty("path");
  });

  it("deve aceitar ações de ciclo de vida e tentativa bloqueada", () => {
    for (const action of ["publication", "revocation", "discard", "blocked-attempt"] as const) {
      expect(
        createSanitizedAuditEvent({
          actor: "system",
          action,
          version: "1.0.0",
          contentHash: "sha256:hash-001",
          timestamp: "2026-09-10T12:00:00.000Z",
        }).action,
      ).toBe(action);
    }
  });
});
