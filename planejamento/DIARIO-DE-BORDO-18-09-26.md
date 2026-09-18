# Diário de Bordo — 18Set26

## Objetivo do dia

Retomar a validação do laboratório AWS da SPEC 005, coletar evidências do baseline operacional e preparar o próximo ciclo de construção do artefato sintético do enclave.

## Atividades realizadas

- Instância `cofre-lab-parent-001` retomada na região `us-east-1`.
- Status do sistema, instância e EBS confirmados como aprovados.
- Falha de acesso SSH diagnosticada: o firewall interno mantinha o IP administrativo antigo `187.35.243.142`.
- Regra do `nftables` atualizada para o IP vigente `187.101.209.237/32`.
- Persistência confirmada em `/etc/sysconfig/nftables.conf`, incluindo `/etc/nftables/cofre_host.nft`.
- Acesso SSH restabelecido e validado.
- Default Host Management Configuration do Systems Manager configurado; Session Manager validado.
- Baseline do host coletado: Amazon Linux 2023, kernel, Nitro CLI, allocator, armazenamento, rede, firewall e horário.
- IMDSv1 sem token retornou `401`; IMDSv2 com token retornou `200`.
- Egress do host testado: HTTPS permitido, HTTP bloqueado e IPv6 externo sem conectividade.
- Evidências copiadas da EC2 para `evidencias/T003/`.
- Hashes dos relatórios e capturas validados em `SHA256SUMS-ALL.txt`.
- Capturas AWS preservadas para status checks, EBS criptografado, IMDSv2, security group e suporte a Nitro Enclaves.
- `laboratory-baseline.md` e `tasks.md` atualizados sem marcar T003 como concluída.
- Criado o plano `PLANO-ARTEFATO-ENCLAVE-T003.md`.
- Criado o esqueleto local `laboratorio/enclave-sintetico/` com `app.py`, `Dockerfile` e `README.md`.
- Instância EC2 interrompida ao final do ciclo para evitar custos.

## Evidências principais

Os artefatos estão em `evidencias/T003/`:

- `00-metadata.txt` a `08-time-services.txt`;
- `aws-01-status-checks.png` a `aws-05-nitro-instance.png`;
- `SHA256SUMS.txt`;
- `SHA256SUMS-ALL.txt`.

Todos os hashes locais dos relatórios e capturas foram validados como íntegros.

## Resultado e limites

O ciclo comprovou parcialmente o baseline operacional do laboratório AWS. A evidência continua classificada como laboratório sintético, não produtivo. T003 permanece pendente.

Continuam pendentes:

- comprovação de TPM/measured boot;
- teste direto de egress dentro do enclave;
- construção e execução de `.eif` sem `DEBUG_MODE`;
- atestação criptográfica com PCRs não zerados;
- integração controlada com KMS;
- mTLS, descarte operacional e revisão manual final.

## Ponto de retomada — 19Set26

1. Ligar a instância somente durante o próximo ciclo.
2. Aguardar os três status checks aprovados.
3. Conectar pelo Session Manager.
4. Copiar o artefato `laboratorio/enclave-sintetico/` para a EC2.
5. Fixar o digest da imagem base, construir o `.eif` e registrar os hashes.
6. Executar sem `--debug-mode` e registrar PCRs.
7. Executar o probe sintético de DNS, HTTP, HTTPS, IPv4, IPv6, proxy e metadata.
8. Encerrar o enclave, copiar as evidências e interromper a instância.

Nenhum dado real, segredo real ou ambiente produtivo está autorizado.
