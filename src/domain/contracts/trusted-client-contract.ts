export type TrustedClientEnvelope = Readonly<{
  clientId: string;
  clientVersion: string;
  clientHash: string;
  signature: string;
  destination: string;
  issuedAt: string;
}>;

export type TrustedClientVerification = Readonly<{
  trusted: boolean;
  reason:
    | "trusted-client"
    | "invalid-client-integrity"
    | "untrusted-client-version"
    | "untrusted-destination";
}>;

const APPROVED_CLIENT_VERSION = "1.0.0";
const APPROVED_DESTINATION = "cofre-sandbox";

export function verifyTrustedClient(
  envelope: TrustedClientEnvelope,
): TrustedClientVerification {
  if (!envelope.clientHash || !envelope.signature) {
    return { trusted: false, reason: "invalid-client-integrity" };
  }

  if (envelope.clientVersion !== APPROVED_CLIENT_VERSION) {
    return { trusted: false, reason: "untrusted-client-version" };
  }

  if (envelope.destination !== APPROVED_DESTINATION) {
    return { trusted: false, reason: "untrusted-destination" };
  }

  return { trusted: true, reason: "trusted-client" };
}
