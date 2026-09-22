import type { ServiceRole } from "../../domain/contracts/hardening-operational";

export type CertificateStatus = "active" | "expired" | "revoked";

export type PresentedServiceIdentity = Readonly<{
  serviceId: string;
  role: ServiceRole;
  certificateFingerprint: string;
  certificateStatus: CertificateStatus;
}>;

export type ServiceConnectionRequest = Readonly<{
  caller: PresentedServiceIdentity;
  target: PresentedServiceIdentity;
  presentedCertificateFingerprint: string;
}>;

export type ServiceConnectionDecision = Readonly<{
  allowed: boolean;
  reason:
    | "connection-authorized"
    | "client-certificate-required"
    | "certificate-not-active"
    | "certificate-identity-mismatch";
}>;

export function authorizeServiceConnection(
  input: ServiceConnectionRequest,
): ServiceConnectionDecision {
  if (!input.presentedCertificateFingerprint.trim()) {
    return { allowed: false, reason: "client-certificate-required" };
  }

  if (input.caller.certificateStatus !== "active") {
    return { allowed: false, reason: "certificate-not-active" };
  }

  if (input.presentedCertificateFingerprint !== input.caller.certificateFingerprint) {
    return { allowed: false, reason: "certificate-identity-mismatch" };
  }

  return { allowed: true, reason: "connection-authorized" };
}
