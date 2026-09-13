export type PublicationAuthorizationInput = Readonly<{
  source: "sandbox-sintetica" | "quarentena";
  target: "sandbox-sintetica" | "producao";
  curatorId: string;
  approverId: string;
}>;

export type PublicationAuthorization = Readonly<{
  allowed: boolean;
  reason:
    | "sandbox-self-approval"
    | "independent-approver-required"
    | "independent-approval"
    | "automatic-promotion-forbidden";
}>;

export function evaluatePublicationAuthorization(
  input: PublicationAuthorizationInput,
): PublicationAuthorization {
  if (input.source === "sandbox-sintetica" && input.target === "producao") {
    return { allowed: false, reason: "automatic-promotion-forbidden" };
  }

  if (input.target === "producao" && input.approverId === input.curatorId) {
    return { allowed: false, reason: "independent-approver-required" };
  }

  if (input.target === "sandbox-sintetica" && input.approverId === input.curatorId) {
    return { allowed: true, reason: "sandbox-self-approval" };
  }

  return { allowed: true, reason: "independent-approval" };
}
