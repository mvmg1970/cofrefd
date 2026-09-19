# Probe sintético de rede do enclave

Este artefato é somente de laboratório. Ele tenta resolver `example.com` e abrir conexões TCP sintéticas para HTTP, HTTPS e o endpoint de metadata. Não usa dados reais, credenciais ou conteúdo protegido.

## Regras do ciclo AWS

1. copiar o diretório para a EC2 somente depois de iniciar o ciclo;
2. fixar o digest da imagem base antes do build oficial;
3. executar `nitro-cli build-enclave` e registrar o hash do `.eif`;
4. iniciar `parent_receiver.py` no host para receber a saída via vsock;
5. executar sem `--debug-mode`;
6. registrar PCR0, PCR1 e PCR2;
7. capturar somente a saída sanitizada recebida via vsock;
8. encerrar o enclave e confirmar `nitro-cli describe-enclaves` como `[]`;
9. copiar o `.eif`, hashes e logs para `evidencias/T003/`;
10. interromper a instância ao final.

## Atestação sintética

O probe solicita o attestation document ao NSM somente de dentro do enclave.
Para manter a saída sanitizada, o parent recebe apenas o tamanho e o SHA-256
local do documento; o conteúdo assinado não é enviado nem persistido pelo
probe. A ausência de `/dev/nsm` fora de um enclave é esperada.

O build local não comprova o funcionamento do Nitro Enclave. A validação somente ocorre na EC2 aprovada.

## KMS de laboratório

O ciclo KMS usa o `kmstool-enclave-cli` oficial do AWS Nitro Enclaves SDK-C,
compilado no host Linux e copiado para este diretório como `kmstool_enclave_cli`
e `libnsm.so` antes do build do Docker. O parent entrega ao enclave somente
credenciais temporárias da role da instância e o ARN da chave de laboratório.

O probe chama `GenerateDataKey` com atestação. O plaintext nunca é enviado ao
parent: somente tamanho e SHA-256 são reportados. A política KMS deve restringir
o role e os PCRs do EIF assinado final. A chave, o certificado e as credenciais
são exclusivos do laboratório e não podem ser reutilizados em produção.
