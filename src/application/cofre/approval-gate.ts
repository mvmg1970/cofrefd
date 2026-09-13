export type ApprovalInput = Readonly<{
  state: "rejeitado" | "pendente-aprovacao";
  approverId: string;
  environment: "sandbox-sintetica" | "producao";
}>;

export type ApprovalResult = Readonly<
  | { state: "aprovado"; approvedBy: string }
  | { state: "rejeitado"; reason: "package-not-pending" }
>;

export function approvePackage(input: ApprovalInput): ApprovalResult {
  if (input.state !== "pendente-aprovacao") {
    return { state: "rejeitado", reason: "package-not-pending" };
  }

  return { state: "aprovado", approvedBy: input.approverId };
}
