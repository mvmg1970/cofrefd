import { describe, expect, it } from "vitest";
import { routeAfterValidation } from "../../src/application/cofre/validation-gate";

describe("gate após validação", () => {
  it("deve enviar pacote válido para aprovação, sem publicar automaticamente", () => {
    expect(routeAfterValidation({ valid: true })).toEqual({
      state: "pendente-aprovacao",
      canPublish: false,
      canExecute: false,
    });
  });

  it("deve rejeitar pacote inválido e bloquear publicação e execução", () => {
    expect(routeAfterValidation({ valid: false })).toEqual({
      state: "rejeitado",
      canPublish: false,
      canExecute: false,
    });
  });
});
