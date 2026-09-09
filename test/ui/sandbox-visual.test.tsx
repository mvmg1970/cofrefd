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

describe("refinamento visual da sandbox", () => {
  it("deve possuir uma folha de estilos local", () => {
    expect(existsSync(path.join(projectRoot, "src/ui/SandboxApp.css"))).toBe(true);
  });

  it("deve renderizar a composição institucional da primeira tela", () => {
    const markup = renderToStaticMarkup(<SandboxApp />);

    expect(markup).toContain('class="vault-shell"');
    expect(markup).toContain("FLEXDOMINI");
    expect(markup).toContain("Antes de mover");
    expect(markup).toContain('class="hero-visual"');
  });
});
