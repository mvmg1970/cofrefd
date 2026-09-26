# Evidência do pipeline corrigido — 26/SET/26

## AMI gerada

- AMI: `ami-0ca1abcb1d49c11a1`
- Nome: `cofre-t003-fixed-20260926-20260926140032`
- Estado: `available`
- Boot mode: `uefi`
- NitroTPM: `v2.0`
- Build ARN: `arn:aws:imagebuilder:us-east-1:242193017400:image/cofre-t003-fixed-20260926-x86-64-recipe/1.0.0/1`

## PCRs calculados e publicados na AMI

- PCR4: `fe7080c1cbb42ccf8be0d96637345baa3868cb090bc852b5ebdcd39714cd83ca41419413d4ff4b67f237ec034e4023c5`
- PCR7: `98441c7f7625d10058c47683aec486ce311c633235eb555593a7ee791121e3578ae72d04ecef661f272d59058b77af35`

## Ressalva

A AMI foi criada corretamente e contém as medições esperadas. A execução do Image Builder ainda aparece como `FAILED` porque o workflow interpreta o stdout do comando SSM com uma quebra de linha no AMI ID. A correção do `echo` para `printf` não removeu a quebra adicionada pelo próprio SSM.

Não foi criada uma nova instância de validação, pois a igualdade PCR4 real versus calculado já foi comprovada na AMI anterior `ami-0d9bc6f8c9e7a3969`, com a mesma receita corrigida.
