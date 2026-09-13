import type { ProtectedTransmissionEnvelope } from "../curator/local-protection";
import type {
  QuarantineReceipt,
} from "./quarantine-gateway";

export type QuarantineMetadata = Readonly<{
  contentHash: string;
  format: string;
  version: string;
  receivedAt: string;
}>;

export type QuarantineRecord = Readonly<{
  state: "recebido-em-quarentena";
  envelope: ProtectedTransmissionEnvelope;
  metadata: QuarantineMetadata;
}>;

export function createQuarantineRecord(
  receipt: QuarantineReceipt,
  receivedAt: string,
): QuarantineRecord {
  return Object.freeze({
    state: receipt.state,
    envelope: receipt.envelope,
    metadata: Object.freeze({
      contentHash: receipt.envelope.manifest.contentHash,
      format: receipt.envelope.manifest.format,
      version: receipt.envelope.manifest.version,
      receivedAt,
    }),
  });
}
