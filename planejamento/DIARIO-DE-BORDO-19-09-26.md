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

## Resultado

O ciclo comprovou o funcionamento sintético do EIF sem modo debug, a comunicação host-enclave por vsock e o bloqueio de rede externa observado pelo probe. A evidência não comprova assinatura do EIF, atestação aceita por KMS, integração de chaves ou equivalência produtiva.

## Pendências

- assinar o EIF e validar PCR8;
- implementar/verificar atestação externa;
- integrar KMS de laboratório sem exportação;
- validar mTLS, persistência, descarte e auditoria;
- revisão independente final.

A T003 permanece pendente. Não foram usados dados reais e o Gate 0 continua aberto.

## Encerramento

Após a coleta, a instância deve ser interrompida para evitar custos de computação.
