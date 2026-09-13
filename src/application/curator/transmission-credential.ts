import { randomUUID } from "node:crypto";

export type TransmissionCredential = Readonly<{
  tokenId: string;
  clientId: string;
  destination: string;
  issuedAt: number;
  expiresAt: number;
}>;

export type CredentialVerification = Readonly<{
  valid: boolean;
  reason: "valid-credential" | "expired-credential" | "untrusted-destination";
}>;

type IssueCredentialInput = Readonly<{
  clientId: string;
  destination: string;
  issuedAt: number;
  ttlSeconds: number;
}>;

const consumedCredentials = new Set<string>();

export function issueTransmissionCredential(
  input: IssueCredentialInput,
): TransmissionCredential {
  return Object.freeze({
    tokenId: randomUUID(),
    clientId: input.clientId,
    destination: input.destination,
    issuedAt: input.issuedAt,
    expiresAt: input.issuedAt + input.ttlSeconds,
  });
}

export function verifyTransmissionCredential(
  credential: TransmissionCredential,
  expectedDestination: string,
  now: number,
): CredentialVerification {
  if (credential.destination !== expectedDestination || expectedDestination !== "cofre-sandbox") {
    return { valid: false, reason: "untrusted-destination" };
  }

  if (now >= credential.expiresAt) {
    return { valid: false, reason: "expired-credential" };
  }

  return { valid: true, reason: "valid-credential" };
}

export function consumeTransmissionCredential(tokenId: string): boolean {
  if (consumedCredentials.has(tokenId)) {
    return false;
  }

  consumedCredentials.add(tokenId);
  return true;
}
