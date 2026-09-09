# Timeline de Execução e Controle — Cofre Flexdomini

**Data de referência:** 2026-09-09
**Público:** cliente, auditor e responsável pelo projeto
**Status:** roadmap aprovado; execução futura condicionada aos portões descritos
**Classificação atual:** protótipo experimental pré-Gate 0

**Atualização:** o parecer do cliente de 09/09/2026 aprovou a direção do fluxo com alterações obrigatórias. Esta timeline foi ajustada para refletir a cifragem e assinatura no ambiente do Curador antes da transmissão.

## Como ler esta timeline

Cada etapa termina somente quando seu critério de saída e sua evidência forem aprovados. A sequência não representa autorização automática para a etapa seguinte. Dados reais, credenciais reais e promoção a produção permanecem proibidos enquanto o Gate 0 estiver aberto.

## Linha do tempo executiva

| Ordem | Etapa | Estado | Evidência/critério de saída |
|---:|---|---|---|
| 1 | Constituição e regras do projeto | Concluída | Constituição ratificada e regras de segurança registradas |
| 2 | Thin slice sintético | Concluída como protótipo | Testes de domínio, API estreita, segurança e validação documentados |
| 3 | Casca visual da sandbox | Concluída | UI local, 19 testes, type-check, build e revisão humana |
| 4 | Refinamento visual para demonstração | Concluída | UI aprovada pelo cliente, 21 testes, build e revisão visual |
| 5 | Correção de dependências | Concluída | Vite/Vitest atualizados e `npm audit`: 0 vulnerabilidades |
| 6 | Organização documental | Em consolidação | Plano de alinhamento, timeline e manual disponíveis para revisão |
| 7 | Fechamento das decisões do Gate 0 | Pendente | Ata com decisões, owners, riscos aceitos e itens adiados |
| 8 | API estreita real | Pendente | Contrato externo, autenticação, limites, erros e testes de exfiltração |
| 9 | Custódia, executor e criptografia | Pendente | Fronteiras reais, isolamento, KMS/HSM e descarte demonstrados |
| 10 | Curadoria, IAM e auditoria | Pendente | Aprovação, versionamento, revogação e trilha imutável |
| 11 | Operação e segurança independente | Pendente | SLO/RTO/RPO, observabilidade, runbooks e red team |
| 12 | Piloto controlado | Pendente | Dados/jurisdição aprovados, critérios de abortamento e aprovação formal |
| 13 | Decisão de produção | Pendente | Gate específico de produção, separado da aprovação do protótipo |

## Linha detalhada por fase

### Fase A — Governança e Gate 0

**Objetivo:** fechar as decisões que o PRD exige antes de qualquer uso produtivo.

**Entregas:**

- nível de isolamento do executor;
- dados e jurisdições do piloto;
- RTO, RPO, SLO e limites de custo;
- métricas de equivalência dos modelos;
- classificação de decisões de alto impacto;
- owners humanos e revisor independente;
- definição do WINDU;
- política de execução dos agentes;
- política de credenciais, rede, branches, custos e proveniência.

**Portão de saída:** ata de fechamento do Gate 0 aprovada pelo responsável humano.

### Fase B — API estreita real

**Objetivo:** transformar o contrato em uma fronteira de transporte real e segura.

**Entregas:** API HTTP, autenticação, autorização, validação, idempotência, rate limit, timeouts, correlação segura e mapeamento de falhas tipadas.

**Portão de saída:** nenhum payload, plaintext, chave ou stack trace atravessa a fronteira externa.

### Fase C — Custódia, executor e criptografia

**Objetivo:** substituir o repositório em memória por componentes com fronteiras operacionais definidas.

**Entregas:** custódia separada, executor isolado/efêmero, pacotes assinados e versionados, KMS/HSM sem exportação de chaves, descarte e testes de escape.

**Portão de saída:** isolamento e descarte comprovados por testes, inspeções e revisão independente.

### Fase D — Curadoria, IAM e auditoria

**Objetivo:** implementar o fluxo governado do PRD:

`Curador → curadoria/aprovação → FD-Core → API estreita → Cofre → executor`

**Entregas:** papéis, permissões, dupla revisão, versionamento, rollback, revogação e trilha de auditoria sem conteúdo protegido.

**Portão de saída:** nenhum bypass de aprovação ou acesso direto indevido ao armazenamento protegido.

### Fase E — Operação e segurança independente

**Objetivo:** tornar a solução operável, monitorável e contestável.

**Entregas:** logs estruturados, métricas, alertas, SLO/RTO/RPO, rotação de segredos, scanners, runbooks, testes de incidente e red team independente.

**Portão de saída:** incidentes previsíveis possuem detecção, contenção, responsável e procedimento exercitado.

### Fase F — Piloto controlado e produção

**Objetivo:** avaliar uma implantação limitada somente depois das fases anteriores.

**Entregas:** escopo de dados aprovado, threat model, critérios de sucesso/aborto, rollback, revisão independente e aprovação humana formal.

**Portão de saída:** decisão explícita entre piloto, adiamento, descarte ou autorização de produção. Nenhum protótipo é promovido automaticamente.

## Processo SDD aplicado a cada nova etapa

Cada fase futura deve ser executada como uma feature independente:

```text
Constitution
  → Specify
  → Clarify
  → Plan
  → Checklist
  → Tasks
  → Analyze
  → Implement
  → Red → Green → Refactor
  → Regressão e scanners
  → Validação manual
  → Commit seletivo e integração controlada
```

### Evidências obrigatórias

- spec aprovada;
- ambiguidades resolvidas;
- plan e checklist revisados;
- analyze sem conflitos críticos;
- teste Red antes do código;
- Green e refactor com suíte verde;
- type-check, build e scanners aplicáveis;
- revisão humana e, quando exigida, revisão independente;
- riscos residuais e decisões adiadas registrados;
- commit com escopo explícito.

## O que o cliente/auditor pode acompanhar agora

- protótipo local do fluxo sintético;
- UI da sandbox aprovada;
- referências opacas e assinaturas sintéticas;
- resultado autorizado e erros seguros;
- testes automatizados e build;
- documentação de limites e riscos;
- histórico de commits por entrega.

## O que ainda não pode ser alegado

- prontidão para produção;
- isolamento físico real;
- criptografia de produção;
- autenticação ou IAM;
- garantia de limpeza forense;
- uso de dados reais;
- fechamento do Gate 0;
- segurança absoluta ou risco zero.

## Próximo marco

O próximo marco não é implementar código. É fechar as decisões de governança do Gate 0 com owners humanos, critérios de aceite, riscos residuais e autorização explícita para a próxima fase.

## Atualização obrigatória do próximo marco

Antes de qualquer upload, o Curador/cliente deverá aprovar a classificação dos pacotes, o cliente local confiável, o modelo de ameaça, o uso ou não de treinamento, o local de processamento, a política de chaves e as regras de retenção/descarte.
