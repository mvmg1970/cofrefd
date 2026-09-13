import type { ProtectedTransmissionEnvelope } from "../curator/local-protection";

export type PublishedVersion = Readonly<{
  state: "publicado";
  version: string;
  contentHash: string;
  publishedAt: string;
  envelope: ProtectedTransmissionEnvelope;
}>;

export type PublicationResult = PublishedVersion | Readonly<{
  state: "rejeitado";
  reason: "approval-required";
}>;

type PublicationInput = Readonly<{
  state: "aprovado" | "pendente-aprovacao";
  envelope: ProtectedTransmissionEnvelope;
  publishedAt: string;
}>;

export function publishApprovedPackage(input: PublicationInput): PublicationResult {
  if (input.state !== "aprovado") {
    return Object.freeze({ state: "rejeitado", reason: "approval-required" });
  }

  return Object.freeze({
    state: "publicado",
    version: input.envelope.manifest.version,
    contentHash: input.envelope.manifest.contentHash,
    publishedAt: input.publishedAt,
    envelope: input.envelope,
  });
}
