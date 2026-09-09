import { useState, type FormEvent } from "react";
import { useStore } from "zustand";
import { InMemoryAtivoRepository } from "../data/in-memory-ativo-repository";
import { makeProcessarAtivo } from "../domain/usecases/processar-ativo";
import { createSandboxStore } from "../presentation/store/sandbox-store";
import "./SandboxApp.css";

const repository = new InMemoryAtivoRepository();
void repository.salvarSintetico({
  id: "fixture-sintetica-001",
  chaveReferencia: "ref-sintetica-001",
  hashPolitica: "hash-sintetico-001",
  payloadCifrado: "fixture-sintetica-nao-exibida",
  createdAt: "2026-09-09T00:00:00.000Z",
});

const store = createSandboxStore(makeProcessarAtivo(repository));

export const SandboxApp = () => {
  const [referenciaOpaca, setReferenciaOpaca] = useState("ref-sintetica-001");
  const [assinaturaValidacao, setAssinaturaValidacao] = useState("ASSINATURA_VALIDA_sintetica");
  const loading = useStore(store, (state) => state.loading);
  const lastError = useStore(store, (state) => state.lastError);
  const resultado = useStore(store, (state) => state.resultadoProcessamento);
  const logs = useStore(store, (state) => state.logs);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await store.getState().processarAtivo(referenciaOpaca, assinaturaValidacao);
  };

  return (
    <main className="vault-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Flexdomini sandbox">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>FLEXDOMINI</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#sobre">O que é</a>
          <a href="#aplicacoes">Aplicações</a>
          <a href="#como-atua">Como atua</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <div className="hero" id="top">
        <section className="hero-copy" id="sobre">
          <p className="eyebrow">ARQUITETURA COGNITIVA PARA DECISÃO</p>
          <h1>Antes de mover uma peça,<br /><em>compreenda o cofre.</em></h1>
          <p className="hero-lead">Uma sandbox para testar decisões protegidas com contexto mínimo, referências opacas e dados sintéticos.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#processamento">Conheça a sandbox <span aria-hidden="true">→</span></a>
            <a className="button button-secondary" href="#como-atua">Entenda a arquitetura</a>
          </div>
        </section>

        <div className="hero-visual" aria-label="Diagrama abstrato da arquitetura do cofre" role="img">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
          <span className="node node-one" aria-hidden="true" />
          <span className="node node-two" aria-hidden="true" />
          <span className="visual-label label-context">• CONTEXTO</span>
          <span className="visual-label label-coherence">• COERÊNCIA</span>
          <div className="core-emblem">
            <span className="core-symbol" aria-hidden="true">✦</span>
            <strong>FLEXDOMINI</strong>
            <small>Arquitetura de decisão</small>
          </div>
        </div>
      </div>

      <section className="process-card" id="processamento">
        <div className="section-heading">
          <p className="eyebrow">FLUXO SINTÉTICO</p>
          <h2>Processe um ativo protegido</h2>
          <p>Use apenas referências e assinaturas descartáveis para demonstrar o fluxo.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Referência opaca
            <input
              name="referenciaOpaca"
              value={referenciaOpaca}
              onChange={(event) => setReferenciaOpaca(event.target.value)}
            />
          </label>
          <label>
            Assinatura de validação
            <input
              name="assinaturaValidacao"
              value={assinaturaValidacao}
              onChange={(event) => setAssinaturaValidacao(event.target.value)}
            />
          </label>
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? "Processando..." : "Processar ativo"}
          </button>
        </form>

        <section className="result-panel" aria-live="polite">
          <h2>Resultado</h2>
          {resultado && <p className="result-success">Veredito: {resultado.veredito}</p>}
          {lastError && <p className="result-error" role="alert">Erro: {lastError}</p>}
          {!resultado && !lastError && <p className="result-muted">Aguardando solicitação.</p>}
        </section>
      </section>

      <section className="logs-panel" id="como-atua">
        <h2>Logs sanitizados</h2>
        <ul>
          {logs.map((log, index) => <li key={`${index}-${log}`}>{log}</li>)}
        </ul>
      </section>
    </main>
  );
};
