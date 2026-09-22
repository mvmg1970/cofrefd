# Resumo Executivo — 22Set26

## Resultado

O ciclo de hoje consolidou as evidências do laboratório T003 e avançou a T004 com mTLS real em ambiente sintético.

Foram recuperados 37 artefatos T003 da EC2. Todos os hashes do manifesto foram validados na origem, o pacote foi transferido para a máquina local com SHA-256 confirmado e as evidências foram versionadas no Git.

A T004 demonstrou identidade de serviço, rotação, revogação, matriz de confiança e handshake mTLS. A suíte final passou com 34 arquivos e 90 testes, e o build foi concluído com sucesso. Esses resultados comprovam um controle de laboratório, não uma garantia produtiva.

## Por que existe gasto incremental

O host atual não comprovou TPM/measured boot. Para concluir essa parte da T003, precisamos testar uma configuração AWS com NitroTPM, boot UEFI e uma AMI Linux preparada para emitir medições verificáveis. Esse teste exige uma nova preparação de imagem e uma instância temporária, gerando custo incremental de computação e armazenamento.

O gasto não é para ampliar o produto nem para colocar o Cofre em produção. É um experimento controlado para responder uma pergunta de segurança: conseguimos provar, por evidência criptográfica, que o software iniciado no host corresponde à imagem autorizada antes de liberar operações sensíveis?

## Valor do teste

Sem measured boot, o sistema pode validar o enclave e a rede, mas não possui evidência suficiente sobre a cadeia de inicialização do host. Com NitroTPM, UEFI e PCRs, será possível comparar medições esperadas com medições observadas e bloquear a liberação de chaves quando houver divergência.

## Controles de custo

- usar somente dados sintéticos;
- limitar a execução a uma instância de laboratório;
- preparar a AMI apenas para o teste;
- coletar hashes, PCRs e atestação;
- desligar a instância imediatamente após a coleta;
- não autorizar produção nem dados reais;
- registrar todos os resultados no repositório.

## Decisão atual

A T004 está concluída em laboratório. A T003 continua aberta até que NitroTPM/measured boot, descarte verificável e auditoria operacional tenham evidência suficiente e revisão humana.
