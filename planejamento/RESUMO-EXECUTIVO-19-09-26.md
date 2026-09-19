# Resumo Executivo — 19Set26

Hoje o laboratório AWS executou o primeiro probe sintético do Cofre dentro de um EIF sem `DEBUG_MODE`.

O artefato foi construído com imagem base fixada por digest. O allocator foi ajustado para 1024 MiB após o Nitro CLI identificar que a imagem exigia mais que a reserva inicial. O EIF foi criado com PCR0, PCR1 e PCR2 não zerados.

A saída do enclave foi recebida pelo host via vsock. As tentativas de DNS, HTTP, HTTPS e acesso ao endpoint de metadata falharam dentro do enclave, demonstrando o comportamento de isolamento esperado para este laboratório. O enclave encerrou corretamente e `describe-enclaves` retornou `[]`.

As evidências foram copiadas para o ambiente local e todos os hashes foram validados. O ciclo continua classificado como sintético e não produtivo.

## Limites

O EIF ainda não está assinado, não houve integração KMS, validação de atestação externa, PCR8, mTLS, descarte operacional ou revisão independente. A T003 permanece pendente e o Gate 0 continua aberto.

## Próximo marco

Interromper a instância após a coleta e planejar a assinatura controlada do EIF, a atestação e a autorização criptográfica de laboratório, sem dados reais.
