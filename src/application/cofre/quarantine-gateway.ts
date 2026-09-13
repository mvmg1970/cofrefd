import type { ProtectedTransmissionEnvelope } from "../curator/local-protection";

export type QuarantineReceipt = Readonly<{
  state: "recebido-em-quarentena";
  envelope: ProtectedTransmissionEnvelope;
}>;

export type QuarantineRejection = Readonly<{
  state: "rejeitado";
  reason: "plaintext-received";
}>;

type ProtectedInput = ProtectedTransmissionEnvelope | Readonly<{ content: string }>;

export function receiveProtectedPackage(
  input: ProtectedInput,
): QuarantineReceipt | QuarantineRejection {
  if ("content" in input) {
    return Object.freeze({ state: "rejeitado", reason: "plaintext-received" });
  }

  return Object.freeze({
    state: "recebido-em-quarentena",
    envelope: input,
  });
}
