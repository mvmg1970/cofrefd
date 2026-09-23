# Resumo Executivo — 22Set26

## Resultado

O ciclo de hoje consolidou as evidências do laboratório T003 e avançou a T004 com mTLS real em ambiente sintético.

Foram recuperados 37 artefatos T003 da EC2. Todos os hashes do manifesto foram validados na origem, o pacote foi transferido para a máquina local com SHA-256 confirmado e as evidências foram versionadas no Git.

A T004 demonstrou identidade de serviço, rotação, revogação, matriz de confiança e handshake mTLS. A suíte final passou com 34 arquivos e 90 testes, e o build foi concluído com sucesso. Esses resultados comprovam um controle de laboratório, não uma garantia produtiva.

No teste incremental de NitroTPM, a instância `m5.xlarge` e a AMI UEFI com `TpmSupport=v2.0` foram confirmadas. O sistema expôs TPM 2.0, gerou um documento de atestação CBOR e permitiu calcular PCRs de um UKI. Porém, a tentativa de iniciar esse UKI por uma entrada GRUB experimental não completou o boot; a instância foi recuperada e os artefatos foram preservados no commit `888532f`.

## Por que existe gasto incremental

O host atual não comprovou TPM/measured boot. Para concluir essa parte da T003, precisamos testar uma configuração AWS com NitroTPM, boot UEFI e uma AMI Linux preparada para emitir medições verificáveis. Esse teste exige uma nova preparação de imagem e uma instância temporária, gerando custo incremental de computação e armazenamento.

O gasto não é para ampliar o produto nem para colocar o Cofre em produção. É um experimento controlado para responder uma pergunta de segurança: conseguimos provar, por evidência criptográfica, que o software iniciado no host corresponde à imagem autorizada antes de liberar operações sensíveis?

## O que foi comprovado

- o tipo de instância AWS suporta NitroTPM 2.0;
- a AMI pode ser registrada com UEFI e `TpmSupport=v2.0`;
- o kernel reconhece o TPM e o event log;
- o NitroTPM produz atestação criptográfica;
- PCR7 e PCR12 foram observados conforme a referência;
- a coleta é reproduzível e auditável por hashes.

## O que permaneceu bloqueado

O PCR4 real foi `40811F...6401D`, enquanto o valor calculado para o UKI foi `8f2789...db14fe7`. Isso demonstra que o host voltou a iniciar o kernel separado do GRUB, não o UKI calculado. Sem essa correspondência, ainda não há evidência suficiente sobre a cadeia de inicialização do host e a T003 não deve ser marcada como concluída.

O próximo investimento deve financiar uma construção de AMI/UKI suportada, com caminho de boot e recuperação verificáveis, não apenas uma nova tentativa de reboot.

## Controles de custo

- usar somente dados sintéticos;
- limitar a execução a uma instância de laboratório;
- preparar a AMI apenas para o teste;
- coletar hashes, PCRs e atestação;
- desligar a instância imediatamente após a coleta;
- não autorizar produção nem dados reais;
- registrar todos os resultados no repositório.

## Decisão atual

A T004 está concluída em laboratório. A T003 continua aberta até que o UKI seja medido no boot real, o PCR4 coincida com a referência, e descarte verificável e auditoria operacional tenham evidência suficiente e revisão humana.
