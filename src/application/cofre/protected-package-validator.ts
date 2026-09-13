import { isAllowedDeclarativeFormat } from "../../domain/contracts/declarative-format-policy";
import type { ProtectedTransmissionEnvelope } from "../curator/local-protection";
import { verifyProtectedEnvelope } from "../curator/local-protection";

export type ProtectedPackageValidation = Readonly<{
  valid: boolean;
  reason:
    | "valid-protected-package"
    | "forbidden-format"
    | "untrusted-provenance"
    | "untrusted-version"
    | "invalid-signature";
}>;

type ValidationInput = Readonly<{
  envelope: ProtectedTransmissionEnvelope;
  signingPublicKey: string;
  clientId: string;
  expectedClientId: string;
}>;

const APPROVED_VERSION = "1.0.0";

export function validateProtectedPackage(
  input: ValidationInput,
): ProtectedPackageValidation {
  if (!isAllowedDeclarativeFormat(input.envelope.manifest.format)) {
    return { valid: false, reason: "forbidden-format" };
  }

  if (input.clientId !== input.expectedClientId) {
    return { valid: false, reason: "untrusted-provenance" };
  }

  if (input.envelope.manifest.version !== APPROVED_VERSION) {
    return { valid: false, reason: "untrusted-version" };
  }

  if (!verifyProtectedEnvelope(input.envelope, input.signingPublicKey)) {
    return { valid: false, reason: "invalid-signature" };
  }

  return { valid: true, reason: "valid-protected-package" };
}
