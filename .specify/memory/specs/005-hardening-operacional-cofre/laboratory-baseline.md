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

## 8. Atualização de evidências — 19/09/2026

Foi construído e executado um probe sintético dentro de um EIF sem `DEBUG_MODE`.

- Imagem base Amazon Linux fixada pelo digest `sha256:74c545e3e04db388b00bd31d7cc5640d4e9c12058a6d72af938d113da3c82893`.
- EIF criado com Nitro CLI `1.5.0`, `CheckCRC: true` e `IsSigned: false`.
- PCR0, PCR1 e PCR2 foram registrados e não estão zerados.
- O enclave foi executado com 2 CPUs e 1024 MiB alocados.
- A saída foi recebida pelo host via vsock, sem uso do console debug.
- DNS, HTTP, HTTPS e acesso ao endpoint IMDS foram bloqueados dentro do enclave.
- O enclave terminou e `nitro-cli describe-enclaves` retornou `[]`.
- Evidências `09` a `12` e seus hashes foram preservadas em `evidencias/T003/`.

Essa execução comprova um teste sintético de isolamento de rede e ciclo de vida. Não comprova assinatura do EIF, atestação aceita por KMS, custódia de chaves, mTLS ou equivalência produtiva.

## 9. Atualização de evidências — ciclo assinado de 19/09/2026

- EIF assinado com certificado ECDSA temporário de laboratório, sem dados reais.
- `describe-eif` confirmou `IsSigned: true`, `SignatureCheck: true` e `CheckCRC: true`.
- PCR0, PCR1, PCR2 e PCR8 foram registrados e não estão zerados.
- O EIF assinado foi executado sem `--debug-mode` via vsock.
- DNS, HTTP, HTTPS e endpoint IMDS permaneceram bloqueados dentro do enclave.
- O enclave terminou corretamente; `nitro-cli describe-enclaves` retornou `[]`.
- Evidências `13` a `16` e `SHA256SUMS.txt` foram preservadas e validadas localmente.

O certificado é exclusivamente de laboratório, com validade curta, e não comprova atestação aceita por KMS, custódia produtiva, mTLS, descarte ou equivalência produtiva.

## 10. Verificação de TPM e measured boot — 19/09/2026

- Nenhum dispositivo `/dev/tpm*` foi encontrado.
- Nenhum serviço TPM ou measured boot foi identificado.
- Não foram encontrados logs de eventos TPM/EFI.
- O kernel registrou `No TPM chip found, activating TPM-bypass!`.
- A evidência foi preservada em `17-tpm-measured-boot.txt` com SHA-256 `28a5632e770626c3e37817f0c86b0786085b47b5c93a86295b79764420d42322`.

Conclusão: a presença e a medição por TPM não foram comprovadas neste host de laboratório; o item permanece pendente.

## 11. Geração de attestation document — 19/09/2026

- O probe atualizado solicitou o documento ao NSM a partir de dentro do enclave.
- O documento retornado teve 4460 bytes e SHA-256 sanitizado `c06b94519cb1e960c3569d88066a4391423c86a7c40cdc5795aae4c05d6a2aff`.
- O conteúdo do documento não foi enviado ao host nem persistido pelo probe.
- O EIF executou sem `DEBUG_MODE`, com rede externa bloqueada e `describe-enclaves: []`.
- Evidências `18` a `21` foram preservadas e validadas localmente.

Limite: a geração foi comprovada, mas a cadeia de confiança do documento não foi validada por um verificador externo e nenhuma decisão KMS foi executada.

## 12. Validação externa de atestação — 19/09/2026

- Parent gerou nonce aleatório de 32 bytes e o enclave o incluiu no documento.
- Verificador offline confirmou a assinatura COSE do documento.
- Cadeia de certificados Nitro validada até a raiz AWS com SHA-256 `641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b`.
- Nonce, PCR0, PCR1 e PCR2 coincidiram com os valores esperados do EIF.
- Documento bruto foi mantido em arquivo controlado; logs exibiram apenas resultados sanitizados.
- Evidência de verificação: `22-attestation-verification.json`; pacote `T003-evidence-2026-09-19-attestation-verified.tar.gz`.

Conclusão: a geração e a validação criptográfica de laboratório foram comprovadas. KMS, mTLS, descarte e equivalência produtiva continuam pendentes.

## 13. Validação do EIF assinado — 19/09/2026

- EIF assinado com certificado ECDSA temporário de laboratório.
- `IsSigned: true`, `SignatureCheck: true` e `CheckCRC: true`.
- Verificador confirmou assinatura COSE, cadeia Nitro, raiz AWS, nonce de 32 bytes e PCR0–PCR2/PCR8.
- Evidências `27` a `31` preservadas e validadas localmente.

O resultado comprova atestação criptográfica do EIF assinado no laboratório. Não autoriza KMS, produção ou fechamento do Gate 0.

## 14. Integração KMS atestada — 19/09/2026

- `vsock-proxy` ativo para `kms.us-east-1.amazonaws.com:443`.
- `kmstool-enclave-cli` compilado a partir do AWS Nitro Enclaves SDK-C.
- Chave de laboratório `cofrefd-lab-t003`, restrita ao role do parent e aos PCRs finais.
- `GenerateDataKey` executado com atestação e sem `DEBUG_MODE`.
- Resultado sanitizado: `status=ok`, 32 bytes, SHA-256 `36c439060d31d5d18ea4ce59973e2bb418687896278d65fb424087a58759f679`.
- Nenhum plaintext, credencial ou dado real foi registrado no host.
- `describe-enclaves` retornou `[]` após a execução.
- Evidências `32` a `35` preservadas e validadas localmente.

Limite: a autorização KMS foi comprovada somente no laboratório sintético. Não comprova mTLS, descarte, auditoria produtiva, TPM/measured boot ou prontidão de produção.

Revisão manual dos artefatos `32` a `35` concluída pelo responsável; integridade e interpretação dos resultados confirmadas.
