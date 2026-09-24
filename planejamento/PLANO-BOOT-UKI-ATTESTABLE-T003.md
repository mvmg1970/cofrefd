# Plano de Boot UKI Attestable — T003

**Data:** 24/09/2026  
**Classificação:** laboratório sintético; não produtivo  
**Status:** plano para revisão antes de qualquer novo gasto AWS

## Objetivo

Comprovar que o kernel efetivamente iniciado na instância NitroTPM é o UKI
calculado e autorizado, por meio de medições reproduzíveis e atestação. A
T003 somente poderá avançar quando o PCR4 observado no boot real coincidir com
o PCR4 calculado para o artefato que foi iniciado.

Este plano substitui a tentativa anterior baseada em `custom.cfg` e
chainload experimental. Nenhuma nova reinicialização deve ocorrer antes da
revisão deste documento e da confirmação do caminho de recuperação.

## Baseline conhecido

O ciclo de 22/09/2026 comprovou:

- instância `m5.xlarge` com suporte a NitroTPM 2.0 e UEFI;
- AMI de laboratório anterior `ami-083aa23f3fb2ac60a` com `BootMode=uefi` e
  `TpmSupport=v2.0`;
- instância anterior `i-0f0ba023ac3b575ba`, já parada;
- presença de `/dev/tpm0`, `/dev/tpmrm0`, `AMZNTPM2` e `TPMEventLog`;
- emissão de documento de atestação NitroTPM;
- PCR7 e PCR12 compatíveis com a referência;
- PCR4 divergente porque o boot real retornou ao kernel separado carregado
  pelo GRUB.

Esses identificadores são referências históricas. A nova execução deve
registrar novos IDs, hashes e PCRs, sem reutilizar a instância antiga como
atalho.

## AMI, sistema operacional e método de boot

### Requisitos da imagem

Preparar uma nova AMI de laboratório com:

- Amazon Linux 2023 ou outra distribuição explicitamente suportada pelo
  procedimento escolhido;
- firmware UEFI e NitroTPM 2.0 habilitados;
- `systemd-stub`/UKI e carregador de boot suportado pela distribuição;
- UKI contendo kernel, initrd, cmdline e metadados necessários;
- imagem, UKI e configuração de boot produzidos em uma etapa reproduzível;
- hash SHA-256 do UKI registrado antes da execução;
- SSM/Session Manager instalado e validado antes de qualquer reboot;
- nenhum dado real, segredo produtivo ou credencial produtiva.

### Método permitido

O UKI deve ser o artefato primário selecionado pelo caminho de boot suportado
pela distribuição e pela AMI. A seleção deve ser persistente na imagem e
verificável antes do reboot e após o boot.

O procedimento deve demonstrar, antes da coleta final:

1. qual entrada de boot será usada;
2. qual arquivo UKI essa entrada referencia;
3. qual hash foi calculado para esse arquivo;
4. quais PCRs serão medidos por essa cadeia;
5. como a instância será recuperada se a entrada não iniciar.

É proibido depender de edição manual de `custom.cfg`, chainload experimental,
entrada temporária não persistente ou alteração feita diretamente no console
sem registro reproduzível.

## Acesso de recuperação obrigatório

Antes de qualquer reboot, confirmar e registrar:

- instância identificada por um novo ID de laboratório;
- estado `running` e status checks saudáveis;
- SSM/Session Manager conectado e funcional;
- comando remoto simples executado com sucesso;
- console serial ou mecanismo equivalente de recuperação disponível;
- snapshot/AMI de rollback criado e identificado;
- regra de desligamento e limite de custo definidos;
- operador capaz de executar `stop/start` sem depender de SSH.

Não iniciar o reboot se SSM/console, snapshot de rollback ou procedimento de
stop/start não tiverem sido comprovados.

## Artefatos e valores esperados

Registrar em um manifesto versionado de evidências:

| Artefato | Valor |
|---|---|
| ID da AMI | preencher na execução |
| ID da instância | preencher na execução |
| versão do OS/kernel | preencher na execução |
| hash SHA-256 do UKI | preencher após a construção |
| PCR4 esperado | calcular a partir do UKI final |
| PCR7 esperado | registrar a medição observada/autorizada |
| PCR12 esperado | registrar a medição observada/autorizada |
| hash do manifesto | calcular após fechar a coleta |

Como referência histórica, o UKI de 22/09/2026 tinha hash
`f2a8e427040eefff6d35518d5a2cb0d0f3836f97b9bc0b927918357cf9c0e203` e PCR4
esperado iniciado por `8f2789`; esses valores não devem ser reutilizados como
referência da nova imagem.

## Coleta pós-boot

Após o boot, coletar por SSM/console, sem expor segredos:

```bash
date -u
uname -a
cat /etc/os-release
cat /proc/cmdline
find /boot -maxdepth 2 -type f -name '*.efi' -o -name '*uki*' 2>/dev/null
sha256sum /caminho/exato/do/uki
ls -l /dev/tpm0 /dev/tpmrm0
test -r /sys/kernel/security/tpm0/binary_bios_measurements && echo eventlog-ok
cat /sys/class/tpm/tpm0/tpm_version_major 2>/dev/null || true
tpm2_pcrread sha384:4,7,12
nitro-tpm-attest --help 2>/dev/null || true
```

Os comandos efetivamente usados e suas saídas completas devem ser salvos em
arquivos de evidência sanitizados. A coleta deve incluir o caminho do kernel
ativo, o UKI correspondente, o hash do UKI e os PCRs observados no mesmo
boot. O documento de atestação deve receber nonce novo e ser validado sem
publicar conteúdo sensível.

## Critério de sucesso

A etapa de measured boot somente será considerada aprovada quando todos os
itens abaixo forem verdadeiros:

- o sistema iniciou pelo UKI autorizado;
- o hash do UKI iniciado corresponde ao hash do manifesto;
- `PCR4_real == PCR4_calculado` para o UKI final;
- PCR7 e PCR12 estão dentro da política definida;
- a atestação NitroTPM é válida, recente e vinculada ao nonce da execução;
- a coleta foi feita após o boot real, não por valores calculados apenas no
  host de preparação;
- a instância permaneceu recuperável durante o procedimento;
- todas as evidências foram hashadas e armazenadas sem plaintext, chaves ou
  credenciais.

Se PCR4 divergir, a execução falha, mesmo que PCR7, PCR12 ou a atestação
sejam válidos. Nesse caso, T003 permanece aberta.

## Rollback e preservação de evidências

Em caso de falha de boot, perda de reachability ou divergência de PCR:

1. não sobrescrever o disco, UKI, logs ou manifesto da tentativa;
2. registrar horário, ID da instância e último estado conhecido;
3. tentar recuperação por console/SSM conforme o procedimento aprovado;
4. se necessário, parar a instância e iniciar a cópia de rollback;
5. coletar os artefatos disponíveis antes de qualquer limpeza;
6. marcar os arquivos com um sufixo de falha, por exemplo `.failed-t003`;
7. calcular SHA-256 do pacote de evidências;
8. somente depois desativar a entrada experimental e encerrar o recurso.

Rollback não significa apagar evidências. A AMI/snapshot de recuperação deve
ser preservada até a revisão da execução e sua retenção deve ser registrada.

## Controle de custo e desligamento

Usar apenas uma instância temporária de laboratório. Antes de iniciar:

- definir uma janela máxima de execução;
- registrar o ID da instância e o alarme/orçamento aplicável;
- configurar desligamento após a coleta final;
- manter um comando manual de emergência para parar a instância.

Após a coleta ou após uma falha irrecuperável:

```bash
aws ec2 stop-instances --instance-ids <INSTANCE_ID>
aws ec2 wait instance-stopped --instance-ids <INSTANCE_ID>
```

O comando deve ser executado somente contra o novo ID da instância de
laboratório, conferido visualmente antes da execução. Não iniciar nem alterar
`cofre-lab-parent-001` ou a instância histórica `i-0f0ba023ac3b575ba`.

## Proibições explícitas

- não usar `custom.cfg` para chainload experimental;
- não fazer reboot sem SSM/console e rollback comprovados;
- não marcar T003 como concluída por atestação ou PCR parcial;
- não reutilizar PCR4 calculado de uma imagem diferente;
- não usar dados reais ou credenciais produtivas;
- não deixar a instância ligada após a coleta;
- não apagar artefatos de uma tentativa malsucedida;
- não interpretar este plano como autorização para produção ou fechamento do
  Gate 0.

## Gate de autorização

Antes de qualquer nova execução AWS, revisar e registrar:

- procedimento suportado de boot escolhido;
- AMI e UKI reproduzíveis;
- acesso de recuperação validado;
- snapshot/AMI de rollback identificado;
- PCRs esperados calculados;
- janela de custo aprovada;
- operador responsável pela decisão de abortar;
- comando de desligamento pronto.

Sem esses itens, a próxima ação é corrigir o plano ou a imagem localmente,
nunca reiniciar a instância.
