# Tasks: Hardening Operacional do Cofre

**Feature:** `005-hardening-operacional-cofre`
**Spec:** `spec.md`
**Plan:** `plan.md`
**Checklist:** `checklists/requirements.md`
**Status:** Aprovado — Tasks Gate concluído pelo Curador
**Data:** 2026-09-13

## Regras de execução

- [ ] Nenhuma tarefa usa dados reais, segredos reais ou produção antes do Gate 0.
- [ ] Cada tarefa de código segue Red → Green → Refactor.
- [ ] Cada tarefa possui evidência reproduzível e classificação do ambiente.
- [ ] Falha de segurança bloqueia a tarefa dependente.
- [ ] Nenhum emulador ou laboratório será descrito como controle produtivo equivalente.

## Fase 0 — contratos e laboratório

- [x] **T001** Registrar matriz PRD ↔ parecer do cliente ↔ parecer independente ↔ SPEC 005 ↔ checklist ↔ tarefas.
  **Rastreia:** rastreabilidade SDD.
  **Depende de:** Checklist 005 aprovado.
  **Evidência:** matriz versionada e revisada.

- [x] **T002** Definir contratos tipados para attestation, autorização de chave, identidade de serviço, ingestão persistente, egress, lifecycle e evidência.
  **Rastreia:** FR-001, FR-003, FR-004, FR-006, FR-008, FR-009, FR-010.
  **Depende de:** T001.
  **Evidência:** tipos, invariantes e testes de contrato.

- [ ] **T003** Preparar baseline do Linux nativo dedicado e documentar runtime de microVM, TPM, firewall e ferramentas de laboratório.
  **Rastreia:** DT-001, DT-002, DT-005, DT-008.
  **Depende de:** T001.
  **Evidência:** inventário, versões, configuração e checklist de hardening.

## Fase 1 — identidade, mTLS e custódia

- [ ] **T004** Implementar identidades separadas por serviço e certificados mTLS de laboratório.
  **Rastreia:** FR-002, FR-009, DT-007.
  **Depende de:** T002, T003.
  **Evidência:** teste de autenticação, rotação, revogação e abuso entre papéis.

- [ ] **T005** Implementar emulador KMS/HSM provider-neutral sem exportação de chaves privadas.
  **Rastreia:** FR-001, FR-002, DT-003.
  **Depende de:** T002, T004.
  **Evidência:** API, testes negativos de exportação e logs sanitizados.

- [ ] **T006** Implementar verificador TPM/measured boot e política de attestation.
  **Rastreia:** FR-001, FR-003, DT-002.
  **Depende de:** T003, T005.
  **Evidência:** relatório de medição válido, inválido, expirado e divergente.

- [ ] **T007** Implementar autorização de chave vinculada a executor, código, imagem, ambiente, pacote, audiência e request ID único.
  **Rastreia:** FR-001, FR-002, FR-006, FR-010.
  **Depende de:** T004, T005, T006.
  **Evidência:** testes positivos/negativos e falhas seguras.

## Fase 2 — persistência e ingestão

- [ ] **T008** Implementar SQLite protegido com WAL, migrações, controle de acesso e transações atômicas.
  **Rastreia:** FR-004, FR-005, FR-010, DT-004.
  **Depende de:** T002, T003.
  **Evidência:** teste de persistência, corrupção, rollback e recuperação.

- [ ] **T009** Implementar gateway mTLS integrado à validação de destino, credencial, assinatura, integridade e formato.
  **Rastreia:** FR-004, FR-005.
  **Depende de:** T004, T008.
  **Evidência:** nenhuma entrada inválida chega à quarentena.

- [ ] **T010** Implementar quarentena persistente com metadados mínimos, transições monotônicas e bloqueio de execução/publicação.
  **Rastreia:** FR-004, FR-005, FR-010.
  **Depende de:** T008, T009.
  **Evidência:** testes de estado, reinício e falhas parciais.

- [ ] **T011** Implementar anti-replay durável com reserva atômica, TTL, audiência e vínculo ao pacote/executor.
  **Rastreia:** FR-006, FR-010.
  **Depende de:** T008, T009.
  **Evidência:** teste concorrente, replay após reinício e request duplicado.

## Fase 3 — microVM e rede

- [ ] **T012** Implementar criação e destruição de microVM com imagem imutável, filesystem efêmero e ausência de privilégios excessivos.
  **Rastreia:** FR-003, DT-001.
  **Depende de:** T003, T006.
  **Evidência:** configuração inspecionada, identidade e limpeza após encerramento.

- [ ] **T013** Integrar execução real da operação sintética dentro da microVM, sem fabricar o resultado fora do workload.
  **Rastreia:** FR-003, FR-010.
  **Depende de:** T007, T010, T012.
  **Evidência:** execução controlada, limites de CPU/memória/tempo e ausência de acesso ao host.

- [ ] **T014** Implementar firewall deny-by-default e allowlist versionada para a microVM.
  **Rastreia:** FR-003, FR-007, DT-005.
  **Depende de:** T003, T012.
  **Evidência:** política aplicada no runtime e inspeção de regras.

- [ ] **T015** Executar testes de egress contra HTTP, DNS, IPv4/IPv6, proxy, sockets, subprocessos e endpoints de metadados.
  **Rastreia:** FR-007, FR-009, FR-010.
  **Depende de:** T013, T014.
  **Evidência:** tentativas bloqueadas, eventos correlacionados e nenhum conteúdo externo.

## Fase 4 — lifecycle e auditoria

- [ ] **T016** Implementar cópias sintéticas cifradas para backup, réplica e snapshot com lifecycle controlado.
  **Rastreia:** FR-008, DT-006.
  **Depende de:** T005, T008.
  **Evidência:** cópia, restauração controlada, acesso autorizado e retenção.

- [ ] **T017** Implementar worker de retenção e descarte para pacote, cópias, chaves, memória e resíduos.
  **Rastreia:** FR-008, FR-010.
  **Depende de:** T010, T016.
  **Evidência:** descarte após 24 horas, hold legal/investigação, histórico de 90 dias e ativo até revogação.

- [ ] **T018** Centralizar auditoria sanitizada para todos os eventos operacionais e canais de telemetria.
  **Rastreia:** FR-009, FR-010.
  **Depende de:** T004, T008, T010, T013, T015, T017.
  **Evidência:** logs, traces, métricas, dumps e falhas sem plaintext/chaves/caminhos.

## Fase 5 — integração e validação

- [ ] **T019** Integrar ingestão, attestation, custódia, microVM, firewall, persistência, lifecycle e auditoria em fluxo controlado.
  **Rastreia:** FR-001–FR-010.
  **Depende de:** T007, T011, T015, T017, T018.
  **Evidência:** fluxo positivo completo e matriz de falhas sem bypass.

- [ ] **T020** Executar testes de reinício, concorrência, falhas parciais, escape, abuso administrativo e exfiltração.
  **Rastreia:** SC-001–SC-006, FR-010.
  **Depende de:** T019.
  **Evidência:** relatório de testes operacionais reproduzível.

- [ ] **T021** Atualizar threat model, SBOM, proveniência, lockfile e auditoria de dependências em CI hermético.
  **Rastreia:** parecer independente B-001 e governança SDD.
  **Depende de:** T019.
  **Evidência:** artefatos de supply chain e resultados versionados.

- [ ] **T022** Executar revisão independente de segurança sobre o ambiente operacional sintético.
  **Rastreia:** parecer independente e Checklist G.
  **Depende de:** T020, T021.
  **Evidência:** parecer com escopo, versão, achados, limitações e decisão.

- [ ] **T023** Atualizar documentação operacional, matriz, manual, timeline e diário com evidências do ciclo.
  **Rastreia:** rastreabilidade SDD.
  **Depende de:** T022.
  **Evidência:** documentação reconciliada e vinculada aos artefatos.

- [ ] **T024** Submeter nova decisão formal do Gate 0, sem presumir autorização de produção.
  **Rastreia:** limites da SPEC 005 e PRD.
  **Depende de:** T022, T023 e decisões operacionais pendentes.
  **Evidência:** decisão humana com escopo, riscos residuais, condições e autorização ou rejeição.

## Critério de conclusão

Uma tarefa somente poderá ser marcada como concluída quando possuir implementação correspondente, testes aprovados, inspeção manual, evidência versionada e classificação explícita do ambiente. A existência desta lista não comprova qualquer controle.

## Evidência de execução

### T002

- Contratos implementados em `src/domain/contracts/hardening-operational.ts`.
- Teste Red executado antes da implementação e falhou por módulo ausente.
- Teste Green: 4 testes aprovados.
- TypeScript: `npx tsc --noEmit` aprovado.
- `git diff --check` aprovado nos arquivos da tarefa.
- Classificação: contrato implementado no código; não comprova controle operacional produtivo.

## Registro do Tasks Gate

**Decisão:** lista de tarefas aprovada pelo Curador/responsável pelo produto.

**Data da aprovação:** 13/09/2026.

**Próximo passo autorizado:** executar a análise SDD da SPEC 005.

**Limite da decisão:** a aprovação não autoriza implementação, produção, uso de dados reais ou fechamento do Gate 0.

## Evidência de execução

### T001

- Matriz criada em `traceability-matrix.md`.
- Cobertura registrada: 10 requisitos, 6 cenários, 8 clarificações e 24 tarefas.
- `git diff --check` aprovado.
- Matriz revisada e aprovada pelo Curador em 13/09/2026.
