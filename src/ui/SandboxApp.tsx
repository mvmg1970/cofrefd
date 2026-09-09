import { useState, type FormEvent } from "react";
import { useStore } from "zustand";
import { InMemoryAtivoRepository } from "../data/in-memory-ativo-repository";
import { makeProcessarAtivo } from "../domain/usecases/processar-ativo";
import { createSandboxStore } from "../presentation/store/sandbox-store";

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
    <main>
      <header>
        <p>COFRE / SANDBOX</p>
        <h1>Sandbox do Cofre</h1>
        <p>Fluxo experimental com referências opacas e dados sintéticos.</p>
      </header>

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
        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : "Processar ativo"}
        </button>
      </form>

      <section aria-live="polite">
        <h2>Resultado</h2>
        {resultado && <p>Veredito: {resultado.veredito}</p>}
        {lastError && <p role="alert">Erro: {lastError}</p>}
        {!resultado && !lastError && <p>Aguardando solicitação.</p>}
      </section>

      <section>
        <h2>Logs sanitizados</h2>
        <ul>
          {logs.map((log, index) => <li key={`${index}-${log}`}>{log}</li>)}
        </ul>
      </section>
    </main>
  );
};
