# Análise do Parecer — Fluxo Protegido de Envio ao Cofre

**Documento analisado:** Parecer técnico estratégico sobre o fluxo protegido de envio, guarda e execução no Cofre
**Data do parecer:** 2026-09-09
**Status:** análise registrada — alterações obrigatórias incorporadas e decisões aprovadas pelo Curador
**Documento relacionado:** `PROPOSTA-FLUXO-CURADOR-UPLOAD-EXECUCAO.md`

## 1. Decisão recebida

O parecer considera a proposta coerente e tecnicamente bem direcionada, mas a classifica como:

> aprovado com alterações obrigatórias.

A ressalva central é que a ausência de conteúdo na tela do Operador ainda é apenas uma intenção. A arquitetura precisa impedir tecnicamente o acesso, inclusive por privilégios administrativos, alterações de código, registros técnicos ou uso indevido do serviço de chaves.

## 2. O que foi validado pelo parecer

O parecer reconhece como adequados os seguintes elementos da proposta:

- separação entre Curador e Operador;
- quarentena antes de publicação/execução;
- validação de formato, integridade, assinatura e proveniência;
- versionamento imutável e revogação;
- armazenamento cifrado e gerenciamento externo de chaves;
- executor efêmero com limites de rede, filesystem, memória, CPU e tempo;
- resultado tipado, logs sanitizados e descarte;
- uso de dados sintéticos antes do Gate 0;
- critérios de aceite e reconhecimento dos limites do protótipo.

## 3. Alterações obrigatórias incorporadas ao entendimento do requisito

### 3.1 Proteção começa no ambiente do Curador

O arquivo deve sair do equipamento do Curador já cifrado e assinado. O conteúdo não deve entrar em uma conversa com modelo de IA nem ser enviado em claro para uma página controlada pela mesma infraestrutura.

Isso exige um cliente local confiável, agente ou conector autenticado, assinado e verificável. Esse componente deverá:

1. selecionar somente os arquivos expressamente autorizados;
2. gerar manifesto;
3. assinar e cifrar localmente;
4. transmitir somente o pacote protegido;
5. impedir destinos não aprovados;
6. registrar sua versão na evidência da operação.

### 3.2 Operador sem capacidade administrativa de descriptografia

Não basta remover botões da UI. O Operador não deve possuir permissão para solicitar, receber ou exportar descriptografia.

Também não pode existir uma única autoridade capaz de administrar a infraestrutura, alterar o receptor, implantar executor modificado e pedir as chaves.

### 3.3 Chaves condicionadas a ambiente e código verificados

O serviço de chaves deve liberar material temporário somente para executor específico, autorizado e previamente verificado/atestado. Alterações não aprovadas no executor devem invalidar o acesso às chaves.

### 3.4 Classificação dos pacotes

“Pacote de conhecimento/configuração” é amplo demais para implementação. A primeira versão deve aceitar somente uma lista mínima de formatos declarativos conhecidos.

Macros, scripts, binários, bibliotecas incorporadas e outros executáveis devem permanecer proibidos até decisão específica.

### 3.5 Separação entre configuração e segredo

Pacotes não devem conter senhas, tokens, certificados privados ou credenciais permanentes. Quando houver dependência de segredo, o pacote deve conter apenas uma referência a um gerenciador externo.

### 3.6 Scanners dentro da fronteira

Scanners de malware, segredos, dependências e conteúdo não devem receber arquivos ou trechos por serviços públicos. Devem operar localmente ou dentro do ambiente protegido e retornar somente códigos sanitizados.

### 3.7 Backups, réplicas e descarte

A política deverá definir:

- inclusão ou exclusão em backups;
- localização de réplicas;
- retenção de metadados;
- revogação de versões;
- destruição criptográfica;
- descarte de memória;
- eliminação de snapshots;
- comprovação de que cópias temporárias não permanecem recuperáveis.

### 3.8 Provedor de processamento

Ainda precisa ser decidido se o processamento ocorrerá:

- integralmente dentro do Cofre;
- em modelo local;
- em infraestrutura confidencial;
- em provedor externo sob condições aprovadas.

Se o conteúdo for enviado a uma API externa, ele terá saído da fronteira protegida, mesmo que o Operador não consiga visualizá-lo.

## 4. Comparação com a proposta original

| Tema | Situação na proposta | Situação após parecer |
|---|---|---|
| Curador sem intervenção do Operador | previsto | mantido |
| Operador sem acesso pela UI | previsto | insuficiente sozinho |
| Impossibilidade administrativa de acesso | não demonstrada | requisito obrigatório |
| Cifragem antes da transmissão | não explícita | obrigatória |
| Cliente local confiável | ausente | obrigatório |
| Assinatura e manifesto local | parcial | obrigatórios |
| Executor altamente isolado | previsto | exige atestação/verificação |
| KMS/HSM | previsto | chave condicionada ao executor |
| Formatos permitidos | em aberto | lista mínima declarativa |
| Segredos dentro do pacote | não detalhado | proibidos; usar referências externas |
| Scanners | previstos | proibidos serviços públicos |
| Backups e descarte | parcial | política comprovável obrigatória |
| Processamento externo | em aberto | decisão de fronteira obrigatória |

## 5. Impacto no plano de alinhamento

O fluxo não deve ser implementado como simples upload em uma página web. A próxima feature deverá ser uma fatia vertical de transferência protegida, começando pelo cliente local confiável e pela prova de que o conteúdo deixa o ambiente do Curador cifrado e assinado.

Ordem recomendada:

1. fechar threat model, isolamento e modelo de confiança;
2. classificar os tipos de pacote da primeira versão;
3. definir cliente local, manifesto, assinatura e cifragem;
4. definir autorização temporária e anti-replay;
5. definir recepção cifrada e quarentena;
6. definir atestação do executor e política de chaves;
7. definir retenção, backups, réplicas e descarte;
8. só então especificar a UI do Curador e o painel do Operador.

## 6. Decisões ainda necessárias do Curador/cliente

- Qual é a lista inicial de formatos declarativos permitidos?
- O pacote será configuração, regras, conhecimento recuperável, prompts ou outro artefato?
- É proibido treinamento de modelo nesta primeira versão?
- A publicação será automática após validação ou exigirá aprovação humana?
- Qual é o nível de ameaça que a arquitetura deve suportar?
- O processamento ficará integralmente dentro do Cofre?
- Qual política de retenção, backup, réplica e destruição será adotada?
- Quem aprova versões e quem pode revogá-las?
- Quais estados e métricas cada ator poderá visualizar?

## 7. Conclusão

O parecer confirma a direção do fluxo, mas exige que a confidencialidade deixe de depender de promessa ou ocultação visual e passe a ser consequência de controles técnicos verificáveis.

O documento original deve ser tratado como proposta revisada pendente. Nenhuma implementação de upload, armazenamento ou execução deve começar antes de incorporar estas alterações à spec, obter a aprovação do Curador e iniciar a cadeia SDD completa: plan, checklist, tasks, analyze, Red, Green, refactor e validação independente.
