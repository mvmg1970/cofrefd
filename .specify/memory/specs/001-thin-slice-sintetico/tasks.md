# Tarefas — Thin Slice Sintético

**Feature:** `001-thin-slice-sintetico`
**Status:** rebaselinhado após clarify/analyze
**Regra:** tarefas novas de produção devem ser precedidas por teste vermelho evidenciado.

## Baseline já existente

Estas capacidades existem no código, mas não possuem evidência histórica completa do ciclo Red → Green → Refactor:

- [x] Contrato `Result` e falhas tipadas.
- [x] Entidade e porta de repositório.
- [x] Caso de uso sintético.
- [x] Repositório em memória.
- [x] Store de apresentação.
- [x] Teste inicial de exfiltração.

**Nota:** os itens acima são baseline exploratório, não prova retroativa de TDD estrito.

## Próxima execução ordenada

- [x] **T014 — Teste da Narrow API:** cenários de sucesso, falha tipada e resposta sem payload/segredo executados; passou como teste de caracterização, sem Red histórico.
- [x] **T015 — Implementação/ajuste da Narrow API (Green):** fazer os testes de T014 passarem sem ampliar o contrato externo. Implementação validada pela suíte de testes; a resposta permanece restrita a `status`, `veredito`/`erroCodigo` e `timestamp`.
- [x] **T016 — Teste de logging seguro (Red):** teste criado e executado antes do módulo, falhando por módulo ausente.
- [x] **T017 — Sanitização de logging (Green):** sanitizador mínimo implementado e validado com 2 testes; integração com um logger real não é alegada porque esta feature não transporta payload para a apresentação.
- [x] **T018 — Regressão:** suíte completa executada com 6 arquivos e 16 testes aprovados.
- [x] **T019 — Contrato de processamento efêmero:** limites documentados na spec e no plan; isolamento físico e limpeza forense foram explicitamente deixados fora desta feature.
- [x] **T020 — Validação final:** testes, type-check e `npm audit --omit=optional` executados e registrados em `validation-report.md`.
- [x] **T021 — Revisão humana:** critérios de aceite e riscos residuais revisados. Decisão: manter a feature concluída como baseline validado, aceitando a ausência de evidência histórica Red → Green do T015 e sem reabrir a tarefa. A feature permanece restrita a sandbox/dados sintéticos e não está pronta para produção.

## Fora desta lista

UI Vite, `index.html`, `main.tsx`, KMS/HSM, produção, dados reais e fechamento do Gate 0 não fazem parte da execução desta feature.
