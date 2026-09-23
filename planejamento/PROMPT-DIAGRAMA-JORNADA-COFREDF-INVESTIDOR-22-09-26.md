# Prompt de diagrama — jornada completa do COFREDF

Crie um diagrama executivo, didático e visualmente convincente para um investidor não técnico, explicando a jornada completa do projeto COFREDF desde o início do desenvolvimento até o estado atual em 22 de setembro de 2026.

O diagrama deve mostrar progresso real, evidências produzidas, limites do laboratório e por que ainda existe uma necessidade objetiva de investimento incremental. Não apresentar o projeto como pronto para produção. Diferenciar claramente “comprovado em laboratório”, “em validação” e “bloqueado para o próximo gate”.

Formato: infográfico horizontal 16:9, estilo tecnologia corporativa, sóbrio e confiável, fundo claro, alto contraste, poucos textos por bloco, ícones simples e setas evidentes. Usar português do Brasil correto. Não mostrar código, comandos, credenciais, chaves privadas, endereços IP ou dados reais.

## Título principal

“COFREDF: da arquitetura segura à prova criptográfica do ambiente de execução”

## Subtítulo

“O produto evoluiu por gates de segurança; cada etapa só avança quando existe evidência verificável.”

## Estrutura visual principal

Construa uma linha do tempo em seis etapas, da esquerda para a direita, com uma faixa inferior de evidências e uma faixa superior de decisão de risco.

### Etapa 1 — Fundamento e SDD

Título curto: “Especificação antes da implementação”

Mostrar:

- requisitos funcionais e decisões técnicas;
- rastreabilidade entre especificação, plano, tarefas e evidências;
- contratos de domínio e fronteiras entre apresentação, aplicação, domínio e dados;
- política de segurança orientando o desenvolvimento;
- selo azul: “base governada e rastreável”.

Mensagem visual: o projeto não começou como um protótipo solto; começou com especificação, rastreabilidade e gates.

### Etapa 2 — Cofre e controles de aplicação

Título curto: “Proteção do fluxo sensível”

Mostrar, como peças conectadas:

- ingestão e validação de ativos;
- quarentena e promoção controlada;
- publicação e execução com vínculos explícitos;
- retenção, revogação e descarte;
- auditoria sanitizada;
- bloqueio de exfiltração e de acesso indevido;
- política de liberação de chaves condicionada a aprovação e validação.

Usar selo verde: “controles demonstrados por testes automatizados”.

### Etapa 3 — Evidências T003 e laboratório sintético

Título curto: “Reprodução e integridade da evidência”

Mostrar:

- recuperação dos artefatos originais do laboratório;
- 37 arquivos de evidência;
- manifesto `SHA256SUMS.txt` validado com todos os itens `OK` na origem;
- pacote transferido para a máquina local;
- hashes confirmados e evidências versionadas no Git;
- dados exclusivamente sintéticos;
- ausência de credenciais e dados produtivos.

Usar selo verde: “evidência preservada e auditável”.

### Etapa 4 — T004: identidade e mTLS

Título curto: “Serviços se autenticam mutuamente”

Mostrar:

- identidades separadas por serviço;
- autoridade certificadora de laboratório;
- certificados de cliente e servidor;
- rotação e revogação;
- matriz de pares de serviços autorizados;
- handshake mTLS real;
- rejeição de cliente sem certificado, certificado expirado, revogado ou destinado a outro serviço;
- 34 arquivos de teste e 90 testes aprovados;
- build aprovado;
- selo verde com ressalva: “concluído em laboratório; não equivale a produção”.

### Etapa 5 — NitroTPM e measured boot

Título curto: “O host também precisa ser verificável”

Mostrar o fluxo técnico de forma simples:

1. instância AWS compatível com NitroTPM 2.0;
2. AMI registrada com UEFI e `TpmSupport=v2.0`;
3. Linux reconhece `/dev/tpm0`, `/dev/tpmrm0` e o event log;
4. ferramenta NitroTPM gera documento de atestação CBOR;
5. um UKI é construído com kernel, initramfs, cmdline e metadados;
6. `nitro-tpm-pcr-compute` calcula PCRs esperados;
7. `tpm2_pcrread` coleta PCRs reais.

Mostrar uma comparação central grande:

“PCR7: coincide” + “PCR12: coincide” + “PCR4: diverge”

Explicar visualmente que o UKI foi gerado e medido como referência, mas o boot real voltou ao kernel separado do GRUB. A tentativa de chainload experimental não completou o boot e a instância precisou ser recuperada.

Usar selo amarelo: “NitroTPM comprovado; measured boot do UKI ainda bloqueado”.

### Etapa 6 — Gate atual e próximo investimento

Título curto: “O próximo gasto reduz uma incerteza objetiva”

Mostrar dois caminhos:

- caminho concluído: aplicação protegida → mTLS → atestação NitroTPM → evidência versionada;
- caminho pendente: AMI/UKI attestable → boot suportado → PCR4 real coincide → liberação de chave condicionada.

Mostrar que a instância temporária foi parada após a coleta e que os artefatos foram preservados no repositório.

## Painel de resultados

Criar um quadro compacto com três colunas:

### Comprovado

- arquitetura e SDD rastreáveis;
- controles de aplicação testados;
- evidências T003 preservadas;
- mTLS de laboratório testado;
- NitroTPM presente e capaz de emitir atestação;
- hashes, PCRs e artefatos versionados.

### Em validação

- construção de imagem Linux attestable;
- estratégia de boot UKI suportada;
- integração entre medição do host e política de liberação de chaves.

### Bloqueado até evidência

- PCR4 do boot real coincidente com a referência do UKI;
- comprovação completa de measured boot;
- descarte operacional e auditoria final;
- Gate 0 de produção.

## Fluxo de decisão de segurança

Na parte inferior, desenhe:

“código autorizado” → “imagem autorizada” → “boot medido” → “PCRs verificados” → “atestação válida” → “chave liberada”

Coloque um portão vermelho/amarelo entre “PCRs verificados” e “chave liberada”, com a regra:

“Se qualquer medição divergir, a chave não é liberada.”

## Justificativa para o investidor

Inclua uma caixa de destaque:

“O investimento incremental não é para aumentar capacidade de produção. É para fechar uma incerteza de segurança mensurável: provar que o software que inicia o Cofre é exatamente o ambiente autorizado.”

Inclua três itens de custo controlado:

- uma instância temporária compatível com NitroTPM;
- preparação de uma AMI/UKI com caminho de boot suportado;
- coleta, validação e preservação dos artefatos antes do desligamento.

## Mensagem final

“O COFREDF já demonstrou controles importantes de aplicação, identidade, transporte e atestação em laboratório. O próximo investimento é delimitado: transformar a presença do TPM em prova completa de measured boot e em uma decisão automática de liberação de chaves.”

## Rodapé obrigatório

“Dados sintéticos • laboratório temporário • evidências versionadas • T004 concluída em laboratório • T003 ainda aberta • Gate 0 ainda aberto • nenhum dado real autorizado”

## Direção estética

Usar azul para arquitetura e controles comprovados, verde para evidências aprovadas, amarelo para validações em andamento e vermelho apenas para bloqueios de segurança. Evitar aparência alarmista ou de fracasso. A narrativa deve transmitir progresso disciplinado: cada bloqueio encontrado reduz risco técnico e orienta o próximo gasto.
