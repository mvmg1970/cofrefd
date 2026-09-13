# Matriz de Rastreabilidade — Ingestão Protegida do Curador

**Feature:** `004-ingestao-protegida-curador`
**Data:** 2026-09-10
**Status:** Aprovada — evidência da T001 revisada pelo Curador

Esta matriz relaciona cada requisito da SPEC 004 às fontes da verdade, ao checklist, às tarefas e à evidência esperada. A presença de uma linha não comprova implementação.

## 1. Fontes da verdade

| Código | Fonte |
|---|---|
| PRD | PRD do Cofre Flexdomini |
| SDD | Livro de Spec-Driven Development e Constituição do repositório |
| PARECER | Parecer técnico estratégico do cliente de 09/09/2026 |
| CURADOR | Decisões CLARIFY-001 a CLARIFY-007 |

## 2. Requisitos funcionais

| Requisito | Fonte principal | Checklist | Tarefa | Evidência esperada |
|---|---|---|---|---|
| FR-001 Manifesto, versão e hash | PARECER, SDD | B | T002, T005 | manifesto e testes de contrato |
| FR-002 Assinatura e cifragem prévias | PARECER, CURADOR | B | T006 | captura do transporte sem plaintext |
| FR-003 Rejeição de proteção/destino inválidos | PARECER | B | T004, T007 | testes de assinatura, destino e credencial |
| FR-004 Proibição de plaintext externo | PRD, PARECER | B, E | T006, T008 | teste de egress e inspeção de logs/UI |
| FR-005 Quarentena antes de publicação/execução | PRD, PARECER | C | T008, T009 | teste de estado e bloqueio |
| FR-006 Validação de formato, integridade e proveniência | PRD, PARECER | C | T003, T011 | suíte de validação |
| FR-007 Rejeição sem publicação/execução | PARECER | C, D | T013 | teste de falha e ausência de efeitos |
| FR-008 Scanners internos | PARECER | C | T012 | bloqueio de serviço público |
| FR-009 Aprovação humana explícita | PRD, CURADOR | D | T014 | validação automática não publica |
| FR-010 Autoaprovação somente na sandbox | CURADOR | D | T014, T016 | teste de escopo da exceção |
| FR-011 Aprovador independente em produção | PRD, CURADOR | D | T016 | tentativa de publicação sem independência bloqueada |
| FR-012 Publicação versionada e imutável | PRD, PARECER | D | T015 | teste de hash e imutabilidade |
| FR-013 Sem promoção automática | PRD, CURADOR | D | T016 | tentativa de promoção bloqueada |
| FR-014 Processamento integral no Cofre | CURADOR, PARECER | E | T018 | teste de fronteira e egress |
| FR-015 Chave condicionada a executor/ambiente | PRD, PARECER | E | T017, T018, T020 | política e teste de atestação |
| FR-016 Operador/administrador sem descriptografia | PRD, PARECER | E | T017, T019 | teste negativo de privilégio |
| FR-017 Revogação direta pelo Curador | CURADOR | F | T022 | teste de revogação autorizada |
| FR-018 Revogação bloqueia execução e audita | CURADOR | F, G | T022, T023 | registro sanitizado e execução bloqueada |
| FR-019 Rejeitados/temporários em 24 horas | CURADOR | F | T010 | teste temporal e descarte |
| FR-020 Ativo até revogação | CURADOR | F | T021 | teste de ciclo de vida |
| FR-021 Histórico por 90 dias | CURADOR | F | T021 | teste de retenção e rollback |
| FR-022 Descarte de resíduos e réplicas | PARECER, CURADOR | F, G | T010, T024 | política e evidência de descarte |

## 3. Cenários de aceite

| Cenário | Requisitos | Checklist | Tarefas | Evidência |
|---|---|---|---|---|
| SC-001 Preparação protegida | FR-001, FR-002, FR-004 | B | T005, T006 | pacote cifrado e transporte sem plaintext |
| SC-002 Rejeição em quarentena | FR-005–FR-008 | C | T009, T011–T013 | pacote rejeitado, sem execução/publicação |
| SC-003 Aprovação e publicação | FR-009–FR-013 | D | T014–T016 | aprovação explícita e versão imutável |
| SC-004 Execução interna | FR-014–FR-016 | E | T017–T020 | executor interno, atestado e chave condicionada |
| SC-005 Retenção e revogação | FR-017–FR-022 | F, G | T010, T021–T024 | bloqueio, retenção e descarte verificáveis |

## 4. Decisões de clarificação

| Decisão | Conteúdo | Requisitos relacionados | Artefato de origem |
|---|---|---|---|
| CLARIFY-001 | somente formatos declarativos; sem código executável ou treinamento | FR-006, FR-012 | proposta do fluxo |
| CLARIFY-002 | validação automática + aprovação humana | FR-009, FR-012 | proposta do fluxo |
| CLARIFY-003 | autoaprovação somente na sandbox; produção independente | FR-010, FR-011, FR-013 | proposta do fluxo |
| CLARIFY-004 | processamento integralmente no Cofre | FR-014 | proposta do fluxo |
| CLARIFY-005 | rejeitados/temporários excluídos após 24h, salvo exceção | FR-019, FR-022 | proposta do fluxo |
| CLARIFY-006 | ativo até revogação; históricos por 90 dias | FR-020, FR-021 | proposta do fluxo |
| CLARIFY-007 | Curador revoga diretamente | FR-017, FR-018 | proposta do fluxo |

## 5. Resultado da T001

**Cobertura:** 22 requisitos funcionais, 5 cenários de aceite e 7 decisões de clarificação relacionados a checklist, tarefas e evidências.

**Limitação:** a matriz comprova rastreabilidade documental. Não comprova a existência dos componentes, controles de isolamento, criptografia, KMS/HSM, atestação ou operação produtiva.

**Próximo gate:** iniciar a T002 após registrar a aprovação da matriz e verificar o estado dos artefatos.

**Aprovação da T001:** matriz aprovada pelo Curador em 2026-09-10.
