# Matriz de Rastreabilidade — Hardening Operacional do Cofre

**Feature:** `005-hardening-operacional-cofre`
**Data:** 2026-09-13
**Status:** Aprovada — evidência da T001 revisada pelo Curador

Esta matriz relaciona os requisitos da SPEC 005 às fontes da verdade, ao checklist, às tarefas e à evidência esperada. A existência de uma linha não comprova implementação.

## 1. Fontes da verdade

| Código | Fonte |
|---|---|
| PRD | PRD do Cofre Flexdomini |
| SDD | Livro SDD e Constituição do repositório |
| PARECER | Parecer técnico do cliente de 09/09/2026 |
| INDEPENDENTE | Parecer independente da SPEC 004 de 13/09/2026 |
| CURADOR | CLARIFY-001 a CLARIFY-008 da SPEC 005 |

## 2. Requisitos funcionais

| Requisito | Fonte principal | Checklist | Tarefa | Evidência esperada |
|---|---|---|---|---|
| FR-001 Custódia e liberação condicionada | PRD, INDEPENDENTE, CURADOR | B | T005–T007 | attestation, autorização única e teste sem exportação |
| FR-002 Separação de privilégios | PARECER, INDEPENDENTE, CURADOR | B | T004–T007 | testes negativos de Admin/Operador e mTLS |
| FR-003 Executor isolado | PRD, PARECER, INDEPENDENTE, CURADOR | C | T012–T015 | microVM inspecionada, limites, escape e rede |
| FR-004 Ingestão persistente | PARECER, INDEPENDENTE, CURADOR | D | T008–T010 | persistência, atomicidade, reinício e recuperação |
| FR-005 Validação obrigatória | PRD, PARECER | D | T009–T010 | falhas bloqueiam quarentena, publicação e execução |
| FR-006 Anti-replay durável | INDEPENDENTE, CURADOR | D | T011 | concorrência, TTL, audiência e reinício |
| FR-007 Egress deny-by-default | PRD, PARECER, INDEPENDENTE, CURADOR | E | T014–T015 | tentativas de rede bloqueadas em runtime |
| FR-008 Lifecycle e descarte | PARECER, INDEPENDENTE, CURADOR | F | T016–T017 | cópias, retenção, hold e descarte verificável |
| FR-009 Auditoria operacional | PRD, PARECER, INDEPENDENTE | G | T018 | logs, traces, métricas e dumps sanitizados |
| FR-010 Falhas seguras | SDD, INDEPENDENTE | A, D, E, F, G | T019–T022 | falhas parciais sem bypass ou execução |

## 3. Cenários de aceite

| Cenário | Requisito | Checklist | Tarefa |
|---|---|---|---|
| SC-001 Administrador tenta plaintext | FR-002 | B | T004–T007, T020 |
| SC-002 Executor alterado | FR-001, FR-003 | B, C | T006–T007, T012–T013, T020 |
| SC-003 Replay concorrente | FR-006 | D | T011, T020 |
| SC-004 Tentativa de exfiltração | FR-007, FR-009 | E, G | T014–T015, T018, T020 |
| SC-005 Reinício durante ingestão | FR-004, FR-005, FR-010 | D | T008–T010, T019–T020 |
| SC-006 Expiração e retenção | FR-008 | F | T016–T017, T020 |

## 4. Decisões de clarificação

| Decisão | Conteúdo | Requisitos relacionados |
|---|---|---|
| CLARIFY-001 | microVM como fronteira do executor | FR-003 |
| CLARIFY-002 | TPM/measured boot | FR-001, FR-003 |
| CLARIFY-003 | emulador local KMS/HSM sem exportação | FR-001, FR-002 |
| CLARIFY-004 | SQLite com WAL | FR-004, FR-006 |
| CLARIFY-005 | firewall deny-by-default e allowlist | FR-003, FR-007 |
| CLARIFY-006 | cópias sintéticas cifradas e lifecycle | FR-008 |
| CLARIFY-007 | identidades por serviço e mTLS | FR-002, FR-009 |
| CLARIFY-008 | Linux nativo dedicado | FR-003, FR-007 |

## 5. Resultado da T001

**Cobertura:** 10 requisitos funcionais, 6 cenários de aceite, 8 decisões de clarificação, 8 itens de checklist e 24 tarefas relacionados a fontes e evidências.

**Limitação:** a matriz comprova rastreabilidade documental. Não comprova microVM, TPM, KMS/HSM, persistência, firewall, lifecycle ou qualquer controle produtivo.

**Próximo gate:** revisão da matriz pelo Curador e registro da T001 como concluída somente após aprovação e verificação do arquivo versionado.

**Aprovação da T001:** matriz aprovada pelo Curador em 13/09/2026.
