# Decisão Formal do Gate 0 — SPEC 004

**Feature:** `004-ingestao-protegida-curador`
**Data do registro:** 13/09/2026
**Status:** Aprovado pelo Curador/responsável pelo produto

## 1. Evidências consideradas

- SPEC 004, plano, checklist, tarefas, análise e matriz de rastreabilidade;
- implementação sintética e testes automatizados;
- `security-review.md`;
- parecer independente registrado em `security-review-independent-2026-09-13.md`;
- PRD do Cofre Flexdomini, livro SDD e parecer técnico do cliente.

## 2. Decisão proposta

**Manter o Gate 0 aberto.**

Ficam rejeitados, até nova decisão formal:

- uso de dados reais;
- fechamento do Gate 0;
- piloto com dados reais;
- publicação em produção;
- declaração de segurança operacional;
- promoção do thin slice sintético para ambiente produtivo.

## 3. Fundamentação

O revisor independente confirmou a coerência do thin slice sintético, mas identificou bloqueadores que impedem declarar o fluxo protegido como operacional:

- ausência de KMS/HSM e IAM produtivos;
- executor sem isolamento operacional real;
- pipeline persistente e integrado de ingestão ainda não comprovado;
- anti-replay sem estado durável e atômico;
- ausência de prova de egress deny-by-default em runtime;
- retenção, backups, snapshots e descarte sem evidência operacional verificável.

## 4. Condições para reabrir a decisão

Uma nova submissão deverá apresentar evidências reproduzíveis de correção dos achados críticos e altos, incluindo custódia real de chaves, executor isolado, ingestão persistente, controle de egress, anti-replay durável, lifecycle verificável e nova revisão independente.

## 5. Aprovação humana

**Decisão do Curador:** [x] Aprovar esta decisão  [ ] Solicitar alteração
**Nome:** ____________________________________
**Função:** ___________________________________
**Data:** 13/09/2026
**Assinatura ou registro equivalente:** ______________________________

**Registro da aprovação:** `GATE 0 DECISION OK`, confirmado pelo Curador em 13/09/2026.

## 6. Limite

Este documento não autoriza produção, dados reais ou fechamento do Gate 0 enquanto não houver aprovação humana formal e evidências operacionais suficientes.
