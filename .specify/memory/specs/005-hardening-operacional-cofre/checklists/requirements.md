# Checklist de Requisitos — Hardening Operacional do Cofre

**Feature:** `005-hardening-operacional-cofre`
**Spec:** `../spec.md`
**Plan:** `../plan.md`
**Status:** Aprovado — Checklist Gate concluído pelo Curador
**Data:** 2026-09-13

## A. Integridade e limites

- [ ] Todos os dez requisitos funcionais possuem critérios de aceite rastreáveis.
- [ ] Todos os cenários de aceite possuem tarefa e evidência esperada.
- [ ] Gate 0 permanece aberto durante a feature.
- [ ] Uso de dados reais, produção e escolha irreversível de provedor permanecem proibidos.
- [ ] O plano distingue código, laboratório controlado e ambiente produtivo equivalente.

## B. Custódia e privilégios

- [ ] Emulador KMS/HSM não exporta chaves privadas.
- [ ] Liberação exige executor, código, imagem, ambiente, pacote e solicitação única correspondentes.
- [ ] Administrador e Operador não possuem caminho autônomo de descriptografia.
- [ ] Identidades e credenciais são separadas por serviço.
- [ ] mTLS interno, rotação e revogação possuem evidência.

## C. MicroVM e attestation

- [ ] MicroVM é criada com imagem imutável e configuração versionada.
- [ ] TPM/measured boot é verificado antes da liberação de chave.
- [ ] Divergência de medição bloqueia a execução.
- [ ] Filesystem é mínimo, efêmero e sem privilégios excessivos.
- [ ] CPU, memória e tempo possuem limites aplicados pelo runtime.
- [ ] Existem testes de escape, acesso ao host, credenciais e resíduos.

## D. Ingestão, persistência e anti-replay

- [ ] Gateway aceita somente envelope protegido e credencial válida.
- [ ] Quarentena persiste metadados mínimos sem plaintext.
- [ ] SQLite usa WAL, controle de acesso e transações atômicas.
- [ ] Estados não podem regredir nem pular validação/aprovação.
- [ ] Request ID/nonce é reservado atomicamente, possui TTL e audiência.
- [ ] Concorrência, reinício e falhas parciais possuem testes.

## E. Rede e exfiltração

- [ ] Firewall da microVM é deny-by-default.
- [ ] Allowlist é explícita, versionada e revisada.
- [ ] HTTP, DNS, IPv4/IPv6, proxy, sockets, subprocessos e endpoints de metadados são testados.
- [ ] Nenhum pacote, chave ou plaintext é enviado a API, modelo ou provedor externo.
- [ ] Bloqueios de rede produzem auditoria sanitizada.

## F. Lifecycle e cópias

- [ ] Backups, réplicas e snapshots sintéticos são cifrados e controlados.
- [ ] Pacotes rejeitados e temporários respeitam 24 horas, salvo hold legal/investigação.
- [ ] Histórico aprovado respeita 90 dias e ativo permanece até revogação.
- [ ] Memória, chaves temporárias e resíduos possuem descarte verificável.
- [ ] Falhas do lifecycle não deixam cópias órfãs sem alerta.

## G. Auditoria e evidências

- [ ] Eventos de ingestão, validação, autorização, execução, falha, descarte e revogação são correlacionáveis.
- [ ] Logs, traces, métricas, dumps e telemetria não carregam plaintext ou chaves.
- [ ] Cada evidência identifica versão, ambiente, comando, resultado e classificação.
- [ ] Testes reproduzíveis são separados de inspeções operacionais.
- [ ] Nova revisão independente será exigida antes de qualquer uso real.

## H. Rastreabilidade

- [ ] Cada item referencia SPEC, plan, cenário ou decisão CLARIFY-001 a CLARIFY-008.
- [ ] Cada item possui tarefa futura e evidência esperada.
- [ ] PRD, livro SDD, parecer do cliente e parecer independente estão representados.
- [ ] Nenhum item aprovado é tratado como implementação existente.

## Resultado da revisão

**Itens aprovados:** ____ / ____
**Itens pendentes:** ____
**Bloqueadores:** ____
**Revisor:** ______________________________
**Data:** ____/____/________
**Decisão:** [ ] Aprovado  [ ] Aprovado com pendências  [ ] Requer correção

## Critério do Checklist Gate

O checklist somente poderá ser aprovado quando cada requisito tiver critério verificável, tarefa correspondente, evidência esperada e limite explícito entre protótipo sintético e controle produtivo.

## Registro do Checklist Gate

**Decisão:** checklist aprovado pelo Curador/responsável pelo produto.

**Data da aprovação:** 13/09/2026.

**Próximo passo autorizado:** criar e revisar as tarefas ordenadas da SPEC 005.

**Limite da decisão:** a aprovação não comprova a implementação dos controles e não autoriza produção, uso de dados reais ou fechamento do Gate 0.
