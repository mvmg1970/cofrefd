# Resumo Executivo — 18Set26

Hoje concluímos um ciclo controlado de validação do laboratório AWS do Cofre Flexdomini.

O acesso SSH foi recuperado após identificar uma regra `nftables` desatualizada que ainda permitia somente o IP administrativo anterior. A regra foi corrigida para o IP vigente, sua persistência foi confirmada e o acesso SSH foi validado. O Systems Manager também foi configurado e o Session Manager passou a funcionar.

Foram coletadas evidências do Amazon Linux 2023, kernel, Nitro CLI 1.5.0, allocator, volume EBS criptografado, firewall deny-by-default, política de egress do host, IMDSv2 obrigatório, sincronização NTP/chrony e status da instância. Os relatórios e screenshots foram copiados para `evidencias/T003/` e tiveram sua integridade verificada por hashes.

Também foi criado o plano do próximo artefato sintético e seu esqueleto local, composto por um probe de rede, Dockerfile e instruções de execução. O artefato ainda não foi construído nem executado na EC2.

## Situação atual

O laboratório está funcional para o próximo ciclo, mas a T003 permanece pendente. Ainda não há comprovação de TPM/measured boot, egress direto do enclave, atestação sem `DEBUG_MODE`, integração KMS, mTLS ou descarte operacional. O Gate 0 continua aberto e não há autorização para dados reais ou produção.

A instância EC2 foi interrompida ao final do dia para evitar custos de computação.

## Próximo marco

Retomar a instância, construir o `.eif` reproduzível sem modo debug, registrar hashes e PCRs, executar os testes negativos de rede dentro do enclave e preservar as evidências. A etapa continuará restrita a dados sintéticos.
