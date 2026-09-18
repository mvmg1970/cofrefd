# Baseline do Laboratório Operacional — SPEC 005

**Feature:** `005-hardening-operacional-cofre`
**Tarefa:** T003
**Data de preparação:** 2026-09-13
**Status:** Parcialmente comprovado — baseline AWS sintético coletado; controles pendentes

## 1. Objetivo

Definir o baseline mínimo do laboratório AWS onde serão testados Nitro Enclaves, atestação, firewall deny-by-default, mTLS, persistência e descarte. Este documento não afirma que o ambiente produtivo já existe ou está aprovado.

## 2. Evidência coletada em 15/09/2026

- Instância EC2: `m5.xlarge`, Amazon Linux 2023, região `us-east-1`.
- Kernel: `6.18.44-99.149.amzn2023.x86_64`.
- Recursos: 4 vCPUs e aproximadamente 15 GiB de memória livre no baseline.
- Volume raiz: XFS, 30 GiB, EBS criptografado com `aws/ebs`.
- IMDSv2: obrigatório.
- Nitro CLI: `1.5.0`.
- Allocator: serviço habilitado e ativo, com 2 vCPUs e 512 MiB reservados.
- Docker: `25.0.14`, habilitado.
- Enclave sintético: imagem `.eif` criada e executada em `DEBUG_MODE`.
- Execução sintética: mensagem `Hello from the enclave side!` observada no console.
- Medições PCR0, PCR1 e PCR2 geradas e registradas na saída do `describe-enclaves`.
- Enclave encerrado com sucesso; `nitro-cli describe-enclaves` retornou `[]`.
- Instância EC2 interrompida após o teste.

Essas evidências comprovam o funcionamento básico do laboratório AWS e do runtime Nitro Enclaves em modo sintético. Não comprovam segurança produtiva.

## 3. Evidências obrigatórias

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

## 4. Checklist de preparação

- [x] Host Linux de laboratório AWS identificado.
- [x] Acesso ao host restrito e auditável (SSH restrito por `/32` e Session Manager).
- [ ] TPM detectado e medição habilitada.
- [x] Nitro Enclaves habilitado e runtime instalado.
- [x] Firewall configurado com deny-by-default no host.
- [x] Allowlist inicial revisada e SSH restrito ao IP administrativo vigente.
- [x] IPv4, IPv6, DNS, proxy e endpoints de metadados testados no host.
- [x] Storage do laboratório protegido (EBS criptografado com `aws/ebs`).
- [ ] Procedimento de limpeza e descarte definido.
- [x] Nenhum dado real usado.

## 5. Limite atual

O laboratório AWS fornece evidência do host Linux e do Nitro Enclave sintético, mas ainda não fornece evidência suficiente de firewall deny-by-default, política de egress, atestação vinculada ao KMS, mTLS, descarte operacional ou isolamento produtivo. Portanto, T003 permanece pendente.

## 6. Critério de conclusão

T003 somente poderá ser marcada como concluída após inspeção do host, execução dos comandos de inventário, registro das configurações, validação do firewall e revisão manual das evidências. A existência deste checklist não comprova o baseline.

## 7. Atualização de evidências — 18/09/2026

Foi executado um ciclo de validação no host EC2 `cofre-lab-parent-001`, sem dados reais.

### Comprovado neste ciclo

- Amazon Linux 2023.12.20260909 e kernel `6.18.44-99.149.amzn2023.x86_64`.
- Nitro CLI `1.5.0`; allocator ativo e habilitado; nenhum enclave ativo durante a coleta.
- Volume raiz XFS de 30 GiB; criptografia `aws/ebs` confirmada no Console AWS.
- `nftables` com política de entrada `drop` e SSH permitido somente para o IP administrativo vigente.
- Regra persistente em `/etc/sysconfig/nftables.conf`, incluindo `/etc/nftables/cofre_host.nft`.
- HTTPS do host permitido, HTTP bloqueado, IPv6 externo sem conectividade e DNS funcional.
- IMDSv1 sem token retornou `401`; IMDSv2 com token retornou `200`.
- Relógio sincronizado via NTP/chrony.
- Acesso SSH e Session Manager validados.

### Artefatos

Os relatórios e capturas estão em `evidencias/T003/`, incluindo `SHA256SUMS.txt` e `SHA256SUMS-ALL.txt`.

### Pendências que mantêm T003 aberta

- presença e medição de TPM não foram comprovadas;
- egress do enclave ainda não foi testado diretamente;
- atestação sem `DEBUG_MODE` ainda não foi executada;
- integração com KMS, mTLS, descarte operacional e equivalência produtiva continuam pendentes.

Classificação do ciclo: **laboratório sintético; evidência operacional parcial; não produtivo**.
