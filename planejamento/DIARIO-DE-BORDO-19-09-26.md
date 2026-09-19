# Diário de Bordo — 19Set26

## Objetivo

Executar o primeiro ciclo do artefato sintético do enclave sem `DEBUG_MODE`, coletar PCRs e testar o bloqueio de rede por meio de comunicação vsock com o host.

## Atividades

- Instância AWS retomada e status checks aprovados.
- Artefato `enclave-sintetico` copiado para a EC2.
- Imagem base Amazon Linux fixada por digest.
- Dockerfile corrigido para instalar `python3` no Amazon Linux 2023.
- Imagem Docker construída com sucesso.
- EIF criado com Nitro CLI `1.5.0`.
- PCR0, PCR1 e PCR2 registrados.
- Requisito mínimo de memória identificado; allocator ajustado de 512 MiB para 1024 MiB, com backup da configuração.
- Enclave executado sem `--debug-mode`.
- Receptor vsock iniciado no host.
- DNS, HTTP, HTTPS e endpoint IMDS testados dentro do enclave e bloqueados.
- Enclave encerrado; `describe-enclaves` retornou `[]`.
- Evidências copiadas para o ambiente local e hashes validados como íntegros.
- EIF assinado com certificado ECDSA de laboratório e executado sem `DEBUG_MODE`.
- `describe-eif` confirmou `IsSigned: true`, `SignatureCheck: true`, `CheckCRC: true` e PCR8 não zerado.
- O ciclo assinado repetiu os bloqueios de DNS, HTTP, HTTPS e IMDS; `describe-enclaves` retornou `[]`.
- Evidências `13` a `16` foram copiadas para o ambiente local e tiveram integridade validada.
- Verificação do host não encontrou dispositivo TPM, serviço TPM ou event log de measured boot; a evidência `17` foi preservada e validada por hash.
- Probe atualizado solicitou attestation document ao NSM dentro do enclave e reportou somente tamanho e SHA-256 sanitizados.
- Documento de atestação gerado com 4460 bytes; evidências `18` a `21` foram preservadas e validadas.

## Resultado

O ciclo comprovou o funcionamento sintético do EIF sem modo debug, a comunicação host-enclave por vsock, a assinatura de laboratório e o bloqueio de rede externa observado pelo probe. A evidência não comprova atestação aceita por KMS, integração de chaves ou equivalência produtiva.

## Pendências

- implementar/verificar atestação externa;
- integrar KMS de laboratório sem exportação;
- validar mTLS, persistência, descarte e auditoria;
- revisão independente final.
- TPM/measured boot não disponíveis neste host de laboratório.
- Validação externa da assinatura do documento e autorização por KMS ainda não foram executadas.

A T003 permanece pendente. Não foram usados dados reais e o Gate 0 continua aberto.

## Encerramento

Após a coleta, a instância deve ser interrompida para evitar custos de computação.
