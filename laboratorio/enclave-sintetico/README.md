# Probe sintético de rede do enclave

Este artefato é somente de laboratório. Ele tenta resolver `example.com` e abrir conexões TCP sintéticas para HTTP, HTTPS e o endpoint de metadata. Não usa dados reais, credenciais ou conteúdo protegido.

## Regras do ciclo AWS

1. copiar o diretório para a EC2 somente depois de iniciar o ciclo;
2. fixar o digest da imagem base antes do build oficial;
3. executar `nitro-cli build-enclave` e registrar o hash do `.eif`;
4. executar sem `--debug-mode`;
5. registrar PCR0, PCR1 e PCR2;
6. capturar somente a saída sanitizada do probe;
7. encerrar o enclave e confirmar `nitro-cli describe-enclaves` como `[]`;
8. copiar o `.eif`, hashes e logs para `evidencias/T003/`;
9. interromper a instância ao final.

O build local não comprova o funcionamento do Nitro Enclave. A validação somente ocorre na EC2 aprovada.
