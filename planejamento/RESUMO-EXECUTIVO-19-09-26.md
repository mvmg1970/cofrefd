# Resumo Executivo — 19Set26

Hoje o laboratório AWS executou o primeiro probe sintético do Cofre dentro de um EIF sem `DEBUG_MODE`.

O artefato foi construído com imagem base fixada por digest. O allocator foi ajustado para 1024 MiB após o Nitro CLI identificar que a imagem exigia mais que a reserva inicial. O EIF foi criado com PCR0, PCR1 e PCR2 não zerados.

A saída do enclave foi recebida pelo host via vsock. As tentativas de DNS, HTTP, HTTPS e acesso ao endpoint de metadata falharam dentro do enclave, demonstrando o comportamento de isolamento esperado para este laboratório. O enclave encerrou corretamente e `describe-enclaves` retornou `[]`.

O EIF foi assinado com certificado ECDSA de laboratório. O `describe-eif` confirmou `IsSigned: true`, `SignatureCheck: true`, `CheckCRC: true` e PCR8 não zerado. O EIF assinado foi executado sem `DEBUG_MODE`, repetiu os bloqueios de rede e encerrou corretamente. As evidências foram copiadas para o ambiente local e todos os hashes dos artefatos assinados foram validados. O ciclo continua classificado como sintético e não produtivo.

## Limites

Não houve integração KMS, validação de atestação externa, mTLS, descarte operacional ou revisão independente. A assinatura usada é somente de laboratório e não representa uma cadeia produtiva. A T003 permanece pendente e o Gate 0 continua aberto.

## Próximo marco

Concluir o registro documental do ciclo assinado, depois interromper a instância e planejar a atestação e a autorização criptográfica de laboratório, sem dados reais.
