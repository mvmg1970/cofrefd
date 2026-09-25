# Resumo da validação T003 — AMI Attestable/UKI

Data: 25/09/2026 — região `us-east-1`

## Artefatos

- AMI: `ami-0d9bc6f8c9e7a3969`
- Build ARN: `arn:aws:imagebuilder:us-east-1:242193017400:image/cofre-t003-ssm3-20260924-x86-64-recipe/1.0.0/1`
- Instância de validação: `i-0ec43c7a25ded2d5f` — estado final `stopped`
- UKI bootado: `/boot/efi/EFI/BOOT/BOOTX64.EFI`
- Hash SHA-384 do UKI: `4eb6605a9cd0032ea7aae000f961049e404477499ec11563399f3f370e48665742d67a7297cc110fa0bd9bd47c8d7f0d`

## Comparação de PCRs

| PCR | Calculado/tagueado na AMI | Real na atestação NitroTPM | Resultado |
|---|---|---|---|
| PCR4 | `f3c4cb2167c5e7a9c0b6fca5f09ec75958dcaf97b9d3c0823bb56f14b477afcad34e28114b55c817ef5ca08489aa235c` | `f3c4cb2167c5e7a9c0b6fca5f09ec75958dcaf97b9d3c0823bb56f14b477afcad34e28114b55c817ef5ca08489aa235c` | **IGUAL** |
| PCR7 | `98441c7f7625d10058c47683aec486ce311c633235eb555593a7ee791121e3578ae72d04ecef661f272d59058b77af35` | `98441c7f7625d10058c47683aec486ce311c633235eb555593a7ee791121e3578ae72d04ecef661f272d59058b77af35` | **IGUAL** |

## Observações

- SSM respondeu `Online` e foi usado somente como canal temporário de coleta.
- O workflow do Image Builder terminou `FAILED` por rejeitar o AMI ID com quebra de linha, mas a AMI foi criada e ficou `available` com `BootMode=uefi`, `TpmSupport=v2.0`, `PCR4` e `PCR7`.
- O critério técnico do T003 — PCR4 real igual ao PCR4 calculado — foi atendido.
- Não foram usados `custom.cfg`, GRUB chainload ou outro caminho experimental neste fechamento.
- Os logs brutos permanecem nesta pasta e no bucket S3 do laboratório.
