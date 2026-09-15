# Baseline do Laboratório Operacional — SPEC 005

**Feature:** `005-hardening-operacional-cofre`
**Tarefa:** T003
**Data de preparação:** 2026-09-13
**Status:** Pendente — validação exige Linux nativo dedicado

## 1. Objetivo

Definir o baseline mínimo do laboratório onde serão testados microVM, TPM/measured boot, firewall deny-by-default, mTLS, persistência e descarte. Este documento não afirma que o ambiente já existe ou está aprovado.

## 2. Evidências obrigatórias

- distribuição e versão do Linux;
- kernel e configuração de virtualização;
- presença e estado do TPM;
- runtime de microVM e versão;
- ferramenta e regras do firewall;
- política de DNS, IPv4, IPv6 e proxy;
- conta administrativa e separação de acessos;
- armazenamento protegido e método de descarte;
- sincronização de horário;
- coleta de logs sanitizados;
- comandos executados, saída e hash da configuração;
- confirmação de que o host não recebe dados reais.

## 3. Checklist de preparação

- [ ] Host Linux nativo dedicado identificado.
- [ ] Acesso ao host restrito e auditável.
- [ ] TPM detectado e medição habilitada.
- [ ] Virtualização habilitada e runtime de microVM instalado.
- [ ] Firewall configurado com deny-by-default.
- [ ] Allowlist inicial revisada.
- [ ] IPv4, IPv6, DNS, proxy e endpoints de metadados testados.
- [ ] Storage do laboratório protegido.
- [ ] Procedimento de limpeza e descarte definido.
- [ ] Nenhum dado real usado.

## 4. Limite atual

O desenvolvimento atual ocorre em Windows e não fornece evidência suficiente para atestar Linux nativo, TPM, microVM ou firewall operacional. Portanto, T003 permanece pendente até que um host Linux dedicado seja disponibilizado e suas evidências sejam registradas.

## 5. Critério de conclusão

T003 somente poderá ser marcada como concluída após inspeção do host, execução dos comandos de inventário, registro das configurações, validação do firewall e revisão manual das evidências. A existência deste checklist não comprova o baseline.
