import { describe, expect, it } from "vitest";
import { sanitizeLogMessage } from "../../src/infrastructure/security/log-sanitizer";

describe("Sanitizador de logs", () => {
  it("deve substituir conteúdo protegido antes de qualquer registro", () => {
    const segredo = "PLAINTEXT_SECRET_FLAG_FD_CORE_2026";
    const mensagem = `Processando ativo: ${segredo}`;

    const resultado = sanitizeLogMessage(mensagem, [segredo]);

    expect(resultado).not.toContain(segredo);
    expect(resultado).toContain("[REDACTED]");
  });

  it("deve preservar mensagens que não contenham valores protegidos", () => {
    const mensagem = "Processamento autorizado com referência opaca.";

    expect(sanitizeLogMessage(mensagem, [])).toBe(mensagem);
  });
});
