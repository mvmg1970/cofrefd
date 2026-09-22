# Diário de Bordo — 22Set26

## Objetivo do dia

Recuperar e versionar as evidências do laboratório T003, avançar a T004 com mTLS de laboratório e preparar a próxima etapa para comprovar NitroTPM/measured boot.

## Atividades realizadas

- Instância do laboratório AWS retomada exclusivamente para recuperação de evidências.
- Diretório `/home/ssm-user/evidence/T003` localizado na EC2.
- Todos os arquivos do manifesto `SHA256SUMS.txt` validados na EC2 com resultado `OK`.
- Pacote `T003-evidence-2026-09-19.tar.gz` transferido para a máquina local.
- SHA-256 do pacote confirmado: `9a1521d7b0657d0215b144fc73c88c47d23d205b36b3d134ce92b85bc8f3acf0`.
- 37 artefatos T003 extraídos e versionados no commit `caeed74`.
- Branch remota criada: `feat/t004-mtls-laboratorio`.
- Política sintética de identidade, rotação, revogação e matriz de confiança implementada.
- Certificados de laboratório gerados fora do repositório, em diretório temporário.
- CA, certificado de servidor e certificado de cliente validados com OpenSSL 3.5.7.
- Handshake mTLS real executado; cliente sem certificado e certificado revogado foram rejeitados.
- Suíte final: 34 arquivos e 90 testes aprovados; build aprovado.
- T004 registrada como concluída em laboratório, com ressalva explícita de não equivalência produtiva.
- Commits T004 publicados na branch remota até `8c2a8cf`.

## Estado atual

O fluxo mTLS possui evidência sintética reproduzível. A T003 permanece aberta porque o host usado no laboratório não comprovou TPM/measured boot, e ainda faltam evidências operacionais de descarte, auditoria e equivalência produtiva.

## Próximo ciclo

Verificar no AWS CloudShell se o tipo `m5.xlarge` suporta NitroTPM e se a AMI atual possui `TpmSupport=v2.0` e boot UEFI. Para Linux, a AMI precisa ser preparada e registrada com NitroTPM; não basta trocar o tipo da instância.

## Limites e governança

- Nenhum dado real foi utilizado.
- Nenhuma credencial produtiva foi usada.
- O laboratório não é ambiente de produção.
- O Gate 0 continua aberto.
- Qualquer novo gasto AWS deve ser limitado a uma instância/AMI de laboratório, com desligamento após a coleta.
