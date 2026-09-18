# Plano do Artefato Sintético do Enclave — T003

**Data:** 2026-09-18
**Classificação:** laboratório sintético; não produtivo

## Objetivo

Construir na EC2 um artefato `.eif` reproduzível, sem `DEBUG_MODE`, para permitir os testes de atestação e egress do enclave.

## Restrições

- não usar dados reais, credenciais reais ou conteúdo protegido;
- não instalar Docker/WSL no Windows como substituto do ambiente Nitro;
- construir e assinar o artefato somente no host Linux de laboratório;
- manter o código-fonte, Dockerfile, configuração e hashes fora da EC2 antes de iniciar o teste;
- não liberar KMS nem criar política produtiva nesta etapa;
- encerrar o enclave e interromper a instância ao final do ciclo.

## Entradas obrigatórias

- código-fonte sintético versionado;
- Dockerfile mínimo e sem ferramentas de debug;
- versão do Nitro CLI;
- configuração do allocator;
- comando de build e hash da imagem;
- PCR0, PCR1 e PCR2 do `.eif`;
- relatório de execução sem `--debug-mode`.

## Testes do próximo ciclo

1. construir o `.eif` a partir do código versionado;
2. registrar `describe-eif` e os hashes;
3. iniciar sem `--debug-mode`;
4. confirmar PCRs não zerados;
5. executar tentativa de DNS, HTTP, HTTPS, IPv4, IPv6, proxy e metadata dentro do enclave;
6. registrar somente resultados sanitizados;
7. encerrar o enclave e confirmar `describe-enclaves: []`;
8. copiar os artefatos para o projeto local e desligar a instância.

## Critério de saída

O artefato somente será considerado pronto para a próxima etapa quando houver código, build reproduzível, hash, PCRs, execução sem debug, testes negativos de rede e evidência versionada. Isso não equivalerá a produção nem fechará o Gate 0.
