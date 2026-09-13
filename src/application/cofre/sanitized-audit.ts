export type AuditAction =
  | "approval"
  | "publication"
  | "revocation"
  | "discard"
  | "blocked-attempt";

export type SanitizedAuditEvent = Readonly<{
  actor: string;
  action: AuditAction;
  version: string;
  contentHash: string;
  timestamp: string;
}>;

type AuditInput = Readonly<{
  actor: string;
  action: AuditAction;
  version: string;
  contentHash: string;
  timestamp: string;
  plaintext?: string;
  key?: string;
  path?: string;
}>;

export function createSanitizedAuditEvent(input: AuditInput): SanitizedAuditEvent {
  return Object.freeze({
    actor: input.actor,
    action: input.action,
    version: input.version,
    contentHash: input.contentHash,
    timestamp: input.timestamp,
  });
}
