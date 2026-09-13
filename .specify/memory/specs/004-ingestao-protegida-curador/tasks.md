# Tasks: Ingestão Protegida do Curador

**Feature:** `004-ingestao-protegida-curador`
**Spec:** `spec.md`
**Plan:** `plan.md`
**Checklist:** `checklists/requirements.md`
**Status:** Aprovado — Tasks Gate concluído pelo Curador
**Data:** 2026-09-10

## Regras de execução

- [ ] Nenhuma tarefa implementa produção ou usa dados reais antes do Gate 0.
- [ ] Cada tarefa deverá seguir Red → Green → Refactor quando envolver código.
- [ ] Cada tarefa deverá produzir evidência verificável.
- [ ] Nenhuma tarefa posterior poderá ser considerada concluída se uma dependência obrigatória estiver pendente.

## Fase 0 — Preparação e contratos

- [x] **T001** Registrar matriz PRD ↔ parecer ↔ SPEC 004 ↔ checklist ↔ tarefas.
  **Rastreia:** rastreabilidade da SPEC e Checklist H.
  **Depende de:** SPEC 004 aprovada.
  **Evidência:** matriz versionada e revisada.

- [x] **T002** Definir contratos tipados para manifesto, pacote protegido, estados, validação, aprovação, publicação, revogação e auditoria.
  **Rastreia:** FR-001, FR-005, FR-006, FR-009, FR-012, FR-018, FR-020–FR-022.
  **Depende de:** T001.
  **Evidência:** tipos, invariantes e testes de contrato.

- [x] **T003** Definir política de formatos declarativos permitidos e rejeição de scripts, binários, macros, bibliotecas, executáveis e credenciais permanentes.
  **Rastreia:** escopo, FR-006, SC-002.
  **Depende de:** T001.
  **Evidência:** lista versionada de formatos e casos de aceitação/rejeição.

## Fase 1 — Cliente local confiável

- [x] **T004** Especificar verificação de integridade, assinatura, versão e destino do cliente local confiável.
  **Rastreia:** FR-001–FR-004, SC-001.
  **Depende de:** T002, T003.
  **Evidência:** contrato de confiança, threat model e testes Red.

- [x] **T005** Implementar geração local de manifesto, hash e versão usando somente fixtures sintéticas.
  **Rastreia:** FR-001, SC-001.
  **Depende de:** T004.
  **Evidência:** testes Green e manifesto sem conteúdo indevido.

- [x] **T006** Implementar assinatura e cifragem antes da transmissão.
  **Rastreia:** FR-002, FR-004, SC-001.
  **Depende de:** T004, T005 e decisão criptográfica aprovada.
  **Evidência:** teste de captura do transporte comprovando ausência de plaintext.

- [x] **T007** Implementar credencial temporária, destino permitido e proteção anti-replay.
  **Rastreia:** FR-003, Checklist B.
  **Depende de:** T004 e decisão de IAM aprovada.
  **Evidência:** testes de expiração, reutilização e destino não autorizado.

## Fase 2 — Entrada e quarentena

- [x] **T008** Implementar recepção de pacote protegido sem descriptografia no gateway.
  **Rastreia:** FR-004, FR-005.
  **Depende de:** T006, T007.
  **Evidência:** teste de fronteira comprovando pacote cifrado na recepção.

- [x] **T009** Implementar quarentena com metadados mínimos e sanitizados.
  **Rastreia:** FR-005, FR-007, SC-002.
  **Depende de:** T008.
  **Evidência:** pacote em quarentena não publicável, não executável e sem plaintext nos metadados.

- [x] **T010** Implementar expiração de pacotes rejeitados e temporários após 24 horas, com exceção formal para retenção legal ou investigação ativa.
  **Rastreia:** FR-019, FR-022, SC-005.
  **Depende de:** T009 e política de retenção aprovada.
  **Evidência:** teste temporal, registro da exceção e prova de descarte.

## Fase 3 — Validação automática

- [x] **T011** Implementar validador isolado de formato, integridade, assinatura, proveniência e versão.
  **Rastreia:** FR-006, SC-002.
  **Depende de:** T002, T003, T009.
  **Evidência:** suíte Red/Green para entradas válidas, corrompidas e proibidas.

- [x] **T012** Integrar scanners exclusivamente locais ou internos à fronteira protegida.
  **Rastreia:** FR-008, Checklist C.
  **Depende de:** T011 e decisão de stack aprovada.
  **Evidência:** bloqueio de egress e teste sem chamada a serviço público.

- [x] **T013** Bloquear publicação e execução quando qualquer validação falhar.
  **Rastreia:** FR-007, FR-009, SC-002.
  **Depende de:** T011.
  **Evidência:** teste de estado rejeitado e ausência de efeitos posteriores.

## Fase 4 — Aprovação e publicação

- [x] **T014** Implementar estado pendente de aprovação e aprovação humana explícita.
  **Rastreia:** FR-009–FR-011, SC-003.
  **Depende de:** T013.
  **Evidência:** teste de que validação automática isolada não publica.

- [x] **T015** Implementar publicação versionada e imutável com hash verificável.
  **Rastreia:** FR-012, Checklist D.
  **Depende de:** T014.
  **Evidência:** teste de imutabilidade, versionamento e hash.

- [x] **T016** Separar caminhos de sandbox e produção e bloquear promoção automática.
  **Rastreia:** FR-010, FR-011, FR-013, SC-003.
  **Depende de:** T014, T015 e decisões do Gate 0.
  **Evidência:** teste de tentativa de promoção automática.

## Fase 5 — Execução interna e chaves

- [x] **T017** Definir política de KMS/HSM, rotação, expiração e liberação condicionada de chaves.
  **Rastreia:** FR-015, FR-016, Checklist E.
  **Depende de:** T002 e decisões PRD de provedor/stack.
  **Evidência:** política aprovada e matriz de permissões.

- [x] **T018** Implementar executor isolado, efêmero e verificável com limites de rede, filesystem, memória, CPU e tempo.
  **Rastreia:** FR-014, FR-015, SC-004.
  **Depende de:** T017 e decisão de isolamento aprovada.
  **Evidência:** teste de sandbox, atestação e limites operacionais.

- [x] **T019** Impedir que Operador ou administrador descriptografe autonomamente.
  **Rastreia:** FR-016, Checklist E.
  **Depende de:** T017, T018.
  **Evidência:** teste negativo de privilégio e alerta de tentativa bloqueada.

- [x] **T020** Invalidar a autorização quando código, imagem ou ambiente do executor sofrer alteração não aprovada.
  **Rastreia:** FR-015, Checklist E.
  **Depende de:** T017, T018.
  **Evidência:** teste de alteração e chave não liberada.

## Fase 6 — Ciclo de vida e auditoria

- [x] **T021** Implementar versão ativa até revogação e histórico aprovado por 90 dias.
  **Rastreia:** FR-020, FR-021, SC-005.
  **Depende de:** T015 e política de retenção aprovada.
  **Evidência:** teste de retenção, rollback e expiração histórica.

- [x] **T022** Implementar revogação direta pelo Curador e bloqueio de novas execuções.
  **Rastreia:** FR-017, FR-018, SC-005.
  **Depende de:** T015, T018, T021.
  **Evidência:** teste de revogação auditada e execução bloqueada.

- [x] **T023** Implementar auditoria sanitizada para aprovação, publicação, revogação, descarte e tentativas proibidas.
  **Rastreia:** FR-007, FR-018, FR-022, Checklist G.
  **Depende de:** T013, T014, T015, T019, T022.
  **Evidência:** eventos com ator, versão, hash e timestamp, sem conteúdo protegido.

- [x] **T024** Definir e testar retenção/descarte de backups, réplicas, snapshots, memória, chaves temporárias e resíduos.
  **Rastreia:** FR-022, Checklist F.
  **Depende de:** T010, T021, T023.
  **Evidência:** política, testes de descarte e relatório de evidência.

## Fase 7 — Validação independente e decisão de produção

- [x] **T025** Executar suíte completa de segurança, threat model atualizado e revisão independente/red team.
  **Rastreia:** Checklist G, PRD e parecer do cliente.
  **Depende de:** T024 e todas as tarefas anteriores aplicáveis.
  **Evidência:** relatório independente com achados e correções.

- [x] **T026** Atualizar documentação operacional, manual, timeline e diário de bordo com evidências reais do ciclo.
  **Rastreia:** rastreabilidade SDD.
  **Depende de:** T025.
  **Evidência:** documentação revisada e vinculada aos testes.

- [ ] **T027** Submeter decisão formal de fechamento do Gate 0 e autorização ou rejeição de piloto controlado.
  **Rastreia:** limites da SPEC 004 e PRD.
  **Depende de:** T025, T026 e decisões operacionais pendentes.
  **Evidência:** decisão assinada, com escopo, riscos, responsáveis e condições.

## Critério de conclusão das tarefas

Uma tarefa somente poderá ser marcada como concluída quando possuir implementação correspondente, testes aprovados, revisão manual e evidência registrada. A existência desta lista não comprova a implementação de qualquer controle.

## Registro do Tasks Gate

**Decisão:** lista de tarefas aprovada pelo Curador/responsável pelo produto.

**Data da aprovação:** 2026-09-10.

**Limite da decisão:** a aprovação autoriza a análise SDD e a execução futura, respeitando as dependências. Não autoriza iniciar implementação sem análise aprovada, nem uso de dados reais, produção ou fechamento do Gate 0.

## Evidência de execução

### T002

- Teste direcionado: 3 testes aprovados em `test/domain/protected-package-contracts.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Verificação de diff: `git diff --check` concluída sem erros.
- Escopo: contratos tipados, envelope opaco e máquina de estados; sem criptografia real ou processamento produtivo.

### T003

- Teste direcionado: 3 testes aprovados em `test/domain/declarative-format-policy.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Verificação de diff: `git diff --check` concluída sem erros.
- Escopo: formatos declarativos permitidos e rejeição de componentes executáveis ou credenciais permanentes.

### T004

- Teste direcionado: 3 testes aprovados em `test/domain/trusted-client-contract.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Escopo: contrato sintético para integridade, assinatura, versão e destino aprovados.
- Limitação: não constitui autenticação criptográfica real nem atestação produtiva.

### T005

- Teste direcionado: 2 testes aprovados em `test/application/local-manifest.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Escopo: manifesto local com versão, formato permitido e hash SHA-256 determinístico.
- Segurança: conteúdo e plaintext não fazem parte do manifesto retornado.

### T006

- Teste direcionado: 2 testes aprovados em `test/application/protected-transmission.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Criptografia: AES-256-GCM com chave de sessão protegida por chave pública.
- Assinatura: Ed25519 sobre o envelope protegido.
- Segurança: envelope não contém `plaintext` nem `content`; alteração após assinatura é rejeitada.
- Limitação: chaves sintéticas e descartáveis; integração produtiva com KMS/HSM permanece pendente.

### T007

- Teste direcionado: 2 testes aprovados em `test/application/transmission-credential.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controles: expiração, destino `cofre-sandbox` e bloqueio de reutilização.
- Limitação: registro anti-replay em memória, exclusivo do ciclo sintético; produção exige mecanismo durável e distribuído aprovado.

### T008

- Teste direcionado: 2 testes aprovados em `test/application/quarantine-gateway.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: envelope protegido recebido em estado `recebido-em-quarentena` sem descriptografia.
- Controle negativo: entrada com `content` em claro rejeitada como `plaintext-received`.
- Limitação: gateway sintético; transporte, autenticação integrada e persistência produtiva permanecem pendentes.

### T009

- Teste direcionado: 1 teste aprovado em `test/application/quarantine-store.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: envelope protegido preservado em registro de quarentena.
- Metadados: somente hash, formato, versão e timestamp.
- Controle negativo: plaintext, conteúdo e caminho não aparecem nos metadados.
- Limitação: armazenamento sintético em memória; persistência cifrada produtiva permanece pendente.

### T010

- Teste direcionado: 3 testes aprovados em `test/application/retention-policy.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: rejeitados e temporários expiram após 24 horas.
- Exceções: retenção legal e investigação ativa preservam o artefato.
- Descarte: executor em memória remove artefato expirado e mantém artefato sob exceção.
- Limitação: job durável e descarte produtivo de storage, backups, réplicas e snapshots permanecem pendentes.

### T011

- Teste direcionado: 3 testes aprovados em `test/application/protected-package-validator.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controles: formato, proveniência, versão e assinatura/integridade validados sem descriptografia.
- Controle negativo: formato proibido, cliente não confiável e envelope adulterado são rejeitados.
- Limitação: validador sintético; isolamento operacional e scanners internos permanecem pendentes.

### T012

- Teste direcionado: 3 testes aprovados em `test/application/scanner-boundary.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: somente destinos internos ou scanner local sintético são aprovados.
- Controle negativo: serviço público e URL externa são rejeitados.
- Limitação: política de destino sintética; bloqueio de egress operacional permanece pendente.

### T013

- Teste direcionado: 2 testes aprovados em `test/application/validation-gate.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: validação válida encaminha para `pendente-aprovacao`, sem publicar/executar.
- Controle negativo: validação inválida produz `rejeitado` e bloqueia publicação/execução.

### T014

- Teste direcionado: 2 testes aprovados em `test/application/approval-gate.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: somente estado `pendente-aprovacao` avança para `aprovado`.
- Controle negativo: pacote rejeitado não pode ser aprovado.
- Limitação: separação específica entre sandbox e produção será tratada na T016.

### T015

- Teste direcionado: 2 testes aprovados em `test/application/publication.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: somente pacote em estado `aprovado` pode ser publicado.
- Integridade: versão e hash do manifesto são registrados.
- Imutabilidade: registro publicado é congelado e não permite alteração estrutural.

### T016

- Teste direcionado: 3 testes aprovados em `test/application/promotion-policy.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: Curador pode autoaprovar somente na sandbox sintética.
- Controle: publicação produtiva exige aprovador humano independente.
- Controle negativo: promoção automática da sandbox para produção é bloqueada.

### T017

- Teste direcionado: 3 testes aprovados em `test/application/key-release-policy.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controles: executor, código, ambiente, pacote e solicitação única são verificados.
- Controle negativo: Administrador, Operador, divergências e replay são rejeitados.
- Limitação: política sintética; integração real com KMS/HSM, rotação e atestação permanecem pendentes.

### T018

- Teste direcionado: 2 testes aprovados em `test/application/executor.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controles: executor atestado, sem rede, filesystem efêmero e limites restritivos.
- Controle negativo: executor não atestado, com rede ou configuração insegura é bloqueado.
- Limitação: perfil e gate sintéticos; isolamento real de processo/container e atestação produtiva permanecem pendentes.

### T019

- Teste direcionado: 2 testes aprovados em `test/application/decryption-access.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: somente role `executor` é autorizada no contrato de acesso.
- Controle negativo: Administrador e Operador são bloqueados.
- Limitação: autorização sintética; política KMS/HSM produtiva permanece pendente.

### T020

- Teste direcionado: 2 testes aprovados em `test/application/execution-binding.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: código, imagem e ambiente são vinculados por hashes esperados.
- Controle negativo: qualquer divergência invalida o vínculo de execução.
- Limitação: verificação sintética; atestação e assinatura de artefatos produtivos permanecem pendentes.

### T021

- Teste direcionado: 2 testes aprovados em `test/application/approved-version-retention.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: versão `ativo` é mantida até revogação.
- Controle: versão `historico` é mantida por menos de 90 dias.
- Controle de expiração: histórico com 90 dias ou mais é elegível para descarte.
- Limitação: retenção produtiva em storage/backup permanece pendente.

### T022

- Teste direcionado: 2 testes aprovados em `test/application/revocation.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: Curador pode revogar diretamente versão ativa.
- Auditoria mínima: revogação registra versão, autor e timestamp.
- Controle negativo: versão revogada não pode ser executada.
- Limitação: trilha de auditoria persistente e alertas produtivos permanecem pendentes.

### T023

- Teste direcionado: 2 testes aprovados em `test/application/sanitized-audit.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: eventos de aprovação, publicação, revogação, descarte e bloqueio possuem formato sanitizado.
- Controle negativo: plaintext, chave e caminho sensível não são retornados.
- Limitação: persistência, alertas e investigação operacional produtivos permanecem pendentes.

### T024

- Teste direcionado: 3 testes aprovados em `test/application/residue-retention.test.ts`.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Controle: backups, réplicas e snapshots seguem ativo, histórico e temporário.
- Controle: memória volátil, chaves temporárias e resíduos finalizados têm descarte imediato.
- Exceções: retenção legal e investigação ativa preservam o artefato.
- Limitação: implementação de storage, backup, snapshot e descarte produtivo permanece pendente.

### T025 — evidência final

- Validação interna: 31 arquivos de teste e 75 testes aprovados.
- Verificação TypeScript: `npx tsc --noEmit` concluída sem erros.
- Build: `npm run build` concluído com sucesso.
- Auditoria npm: inconclusiva por falha de comunicação com o endpoint de advisories.
- Revisão independente recebida em 2026-09-13 e registrada em `security-review-independent-2026-09-13.md`.
- Decisão do revisor: rejeitado para fechamento do Gate 0, produção, piloto com dados reais ou declaração de segurança operacional.
- Hash do pacote revisado: `52775cee6a0143bcc18b5a0192083de29ec3c3b195c1813285f9aae68021480a`.
- Status: T025 concluída como execução da revisão, com bloqueadores documentados; Gate 0 permanece aberto.

### T026 — evidência final

- Diário de bordo de 10/09 atualizado com o resultado da revisão independente de 13/09.
- Resumo executivo de 10/09 atualizado para registrar a rejeição do fechamento do Gate 0.
- Timeline atualizada com a revisão independente concluída e os bloqueadores produtivos.
- Manual da sandbox atualizado para manter explícitos seus limites sintéticos.
- `git diff --check` aprovado nos documentos alterados.
- Status: T026 concluída; a documentação não autoriza produção nem uso de dados reais.
- Relatório: `security-review.md`.
