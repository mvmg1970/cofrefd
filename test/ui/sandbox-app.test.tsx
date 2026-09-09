import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SandboxApp } from "../../src/ui/SandboxApp";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

describe("casca visual da sandbox", () => {
  it("deve possuir os pontos de entrada do Vite", () => {
    expect(existsSync(path.join(projectRoot, "index.html"))).toBe(true);
    expect(existsSync(path.join(projectRoot, "src/main.tsx"))).toBe(true);
  });

  it("deve renderizar controles para uma solicitação opaca", () => {
    const markup = renderToStaticMarkup(<SandboxApp />);

    expect(markup).toContain("Processe um ativo protegido");
    expect(markup).toContain('name="referenciaOpaca"');
    expect(markup).toContain('name="assinaturaValidacao"');
    expect(markup).toContain("Processar ativo");
  });

  it("não deve renderizar segredo, plaintext ou payload protegido", () => {
    const markup = renderToStaticMarkup(<SandboxApp />);

    expect(markup).not.toContain("PLAINTEXT_SECRET_FLAG_FD_CORE_2026");
    expect(markup).not.toContain("payloadCifrado");
    expect(markup).not.toContain("chaveCriptografica");
  });
});
