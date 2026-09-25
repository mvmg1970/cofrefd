# Resumo executivo — T003 e T004

**Projeto:** CofreDF  
**Branch:** `feat/t004-mtls-laboratorio`  
**Data:** 25/09/2026  
**Ambiente:** laboratório AWS, `us-east-1`, conta `242193017400`

## Resultado executivo

Os dois objetivos de laboratório foram concluídos:

- **T004 — mTLS:** transporte mutual TLS validado com cliente confiável, cliente sem certificado e certificado revogado.
- **T003 — Attestable AMI/UKI:** boot real pelo UKI validado com NitroTPM; o PCR4 real foi igual ao PCR4 calculado a partir da AMI.

Nenhum dado produtivo ou credencial produtiva foi utilizado. A instância de validação foi desligada após a coleta e as evidências foram preservadas.

## T004 — transporte mTLS

- Suíte final: **34 arquivos de teste, 90 testes aprovados**.
- Build de produção do frontend aprovado.
- Handshake mTLS real aprovado.
- Cliente sem certificado rejeitado.
- Certificado revogado rejeitado.
- Certificados de laboratório mantidos fora do repositório, em diretório temporário.

O resultado é válido somente para o laboratório e não representa equivalência produtiva.

## T003 — measured boot com UKI

### Artefato e execução

- AMI validada: `ami-0d9bc6f8c9e7a3969`.
- `BootMode=uefi`.
- `TpmSupport=v2.0`.
- UKI iniciado: `/boot/efi/EFI/BOOT/BOOTX64.EFI`.
- Hash SHA-384 do UKI:

  `4eb6605a9cd0032ea7aae000f961049e404477499ec11563399f3f370e48665742d67a7297cc110fa0bd9bd47c8d7f0d`

- Instância de validação: `i-0ec43c7a25ded2d5f`.
- SSM respondeu `Online` durante a coleta.
- Instância final: `stopped`.

### Comparação de PCRs

| Registro | Calculado/tagueado | Real na atestação NitroTPM | Resultado |
|---|---|---|---|
| PCR4 | `f3c4cb2167c5e7a9c0b6fca5f09ec75958dcaf97b9d3c0823bb56f14b477afcad34e28114b55c817ef5ca08489aa235c` | `f3c4cb2167c5e7a9c0b6fca5f09ec75958dcaf97b9d3c0823bb56f14b477afcad34e28114b55c817ef5ca08489aa235c` | **IGUAL** |
| PCR7 | `98441c7f7625d10058c47683aec486ce311c633235eb555593a7ee791121e3578ae72d04ecef661f272d59058b77af35` | `98441c7f7625d10058c47683aec486ce311c633235eb555593a7ee791121e3578ae72d04ecef661f272d59058b77af35` | **IGUAL** |

O nonce da atestação foi fresco, com 32 bytes, e retornou no documento NitroTPM.

### Ressalva operacional

O Image Builder marcou a execução como `FAILED` porque o workflow rejeitou o AMI ID retornado com quebra de linha:

```text
Invalid ImageId output value, must be AMI ID as a string
```

A AMI, entretanto, foi criada, ficou `available`, recebeu as tags PCR e foi inicializada com sucesso. Portanto, o critério criptográfico do T003 foi atendido, mas o workflow precisa de correção (`trim()` no AMI ID) antes de ser considerado operacionalmente verde.

## Segurança e governança

- Não foi usado `custom.cfg`.
- Não foi usado chainload experimental.
- A receita final usa UKI como artefato primário de boot.
- O SSM foi habilitado somente como canal temporário e controlado de coleta.
- Evidências, logs, AMI e snapshots não foram apagados.
- A instância de validação foi desligada após o teste.

## Evidências versionadas

- Resumo detalhado: `evidencias/T003-attestable-ami-20260924/resumo-validacao-ssm3.md`.
- Logs do Image Builder: `evidencias/T003-attestable-ami-20260924/`.
- Receita corrigida: `laboratorio/cofre-t003-attestable-ssm-recipe/`.
- Commit de fechamento técnico: `1078b60`.

## Próximos passos

1. Corrigir o parser do workflow `CreateOutputAmi` para remover a quebra de linha do AMI ID.
2. Executar uma nova construção apenas para obter status verde do pipeline, se necessário.
3. Manter T003 como tecnicamente aprovado, com a ressalva operacional documentada.
4. Avaliar o encerramento controlado das stacks AWS somente depois de confirmar que todas as evidências foram copiadas e preservadas.
