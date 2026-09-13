export type ValidationGateResult = Readonly<{
  state: "rejeitado" | "pendente-aprovacao";
  canPublish: boolean;
  canExecute: boolean;
}>;

export function routeAfterValidation(input: Readonly<{ valid: boolean }>): ValidationGateResult {
  if (!input.valid) {
    return { state: "rejeitado", canPublish: false, canExecute: false };
  }

  return { state: "pendente-aprovacao", canPublish: false, canExecute: false };
}
