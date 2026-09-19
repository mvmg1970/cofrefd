# Resumo Executivo — 19Set26

Hoje o laboratório AWS executou o primeiro probe sintético do Cofre dentro de um EIF sem `DEBUG_MODE`.

O artefato foi construído com imagem base fixada por digest. O allocator foi ajustado para 1024 MiB após o Nitro CLI identificar que a imagem exigia mais que a reserva inicial. O EIF foi criado com PCR0, PCR1 e PCR2 não zerados.

A saída do enclave foi recebida pelo host via vsock. As tentativas de DNS, HTTP, HTTPS e acesso ao endpoint de metadata falharam dentro do enclave, demonstrando o comportamento de isolamento esperado para este laboratório. O enclave encerrou corretamente e `describe-enclaves` retornou `[]`.

O EIF foi assinado com certificado ECDSA de laboratório. O `describe-eif` confirmou `IsSigned: true`, `SignatureCheck: true`, `CheckCRC: true` e PCR8 não zerado. O EIF assinado foi executado sem `DEBUG_MODE`, repetiu os bloqueios de rede e encerrou corretamente. As evidências foram copiadas para o ambiente local e todos os hashes dos artefatos assinados foram validados. O ciclo continua classificado como sintético e não produtivo.

A verificação complementar não encontrou `/dev/tpm*`, serviços TPM, event log TPM/EFI ou suporte de measured boot; o kernel registrou `No TPM chip found`. Essa limitação foi preservada na evidência 17 e confirmada por hash.

O probe foi atualizado para solicitar um attestation document ao NSM dentro do enclave. O host recebeu somente tamanho e SHA-256 sanitizados do documento, que teve 4460 bytes. As evidências 18–21 foram validadas localmente. Isso comprova a geração do documento pelo NSM, mas não sua validação externa nem autorização por KMS.

Em seguida, o fluxo completo foi executado com nonce gerado pelo parent. O verificador offline confirmou assinatura COSE, cadeia de certificados Nitro, fingerprint da raiz AWS, nonce de 32 bytes e correspondência dos PCR0–PCR2. O resultado foi preservado em `22-attestation-verification.json`; todos os hashes do pacote atualizado foram validados localmente.

## Limites

Não houve integração KMS, mTLS, descarte operacional ou revisão independente. A assinatura do EIF continua sendo somente de laboratório e não representa uma cadeia produtiva. A T003 permanece pendente e o Gate 0 continua aberto.

## Próximo marco

Concluir o registro documental do ciclo assinado, depois interromper a instância e planejar a atestação e a autorização criptográfica de laboratório, sem dados reais.
