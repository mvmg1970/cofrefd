# Proposta de Fluxo do Curador — Envio, Guarda e Execução Protegida

**Versão:** 2.0
**Data:** 2026-09-09
**Status:** aprovada pelo Curador com as alterações obrigatórias do parecer
**Classificação:** requisito funcional preliminar, pré-Gate 0

## 1. Objetivo

Permitir que o Curador envie, remotamente e sem intervenção manual do operador, os arquivos que configuram o conhecimento ou o comportamento autorizado do motor do Cofre.

O sistema deverá receber, validar, proteger, versionar e disponibilizar esses arquivos para execução em ambiente altamente isolado. O operador deverá acompanhar o andamento e o resultado sem visualizar o conteúdo enviado.

Este documento descreve um fluxo proposto. Ele não autoriza ainda dados reais, implantação produtiva, treinamento automático de modelos ou escolha definitiva de provedor.

## 2. Termos usados

### Curador

Pessoa responsável por preparar e enviar um pacote de conhecimento/configuração para o motor. O Curador possui autorização para submeter o pacote, mas não acessa diretamente o armazenamento protegido nem o executor.

### Operador

Pessoa responsável por acompanhar o funcionamento técnico do sistema. O Operador visualiza estados, resultados, falhas e evidências operacionais, mas não visualiza o conteúdo dos arquivos enviados.

### Pacote de conhecimento/configuração

Conjunto de arquivos versionado que orienta o motor dentro de um escopo aprovado. O termo não significa, por si só, treinamento ou alteração permanente de um modelo. Essa decisão precisará ser especificada separadamente.

### Executor

Ambiente efêmero e altamente isolado que utiliza um pacote autorizado para realizar o processamento solicitado.

## 3. Resultado esperado para o Curador

Ao final do envio, o Curador deverá receber:

- confirmação de recebimento;
- identificador opaco do pacote;
- versão registrada;
- estado da validação;
- estado da aprovação/publicação, quando aplicável;
- motivo seguro em caso de rejeição;
- nenhum conteúdo protegido refletido em mensagens ou logs externos.

## 4. Resultado esperado para o Operador

O Operador deverá conseguir acompanhar:

- pacote recebido ou não recebido;
- validação em andamento, aprovada ou rejeitada;
- execução iniciada, concluída ou interrompida;
- resultado autorizado ou erro tipado;
- duração, correlação e métricas operacionais permitidas;
- evidências de descarte do executor;
- alertas de segurança.

O Operador não deverá conseguir baixar, abrir, copiar, pesquisar ou reconstruir o conteúdo do pacote.

## 5. Fluxo proposto

```text
Curador
  → autenticação e autorização
  → cliente local confiável
  → manifesto, assinatura e cifragem local
  → transmissão direta do pacote protegido
  → quarentena
  → validação de formato, integridade e segurança
  → assinatura/versionamento
  → armazenamento cifrado
  → aprovação/publicação automática ou governada
  → referência opaca
  → executor altamente isolado
  → resultado tipado
  → painel do Operador
```

## 6. Etapas detalhadas

### Etapa 1 — Acesso do Curador

O Curador acessa uma tela autenticada. O sistema verifica identidade, função, escopo e permissões antes de aceitar qualquer arquivo.

O Curador não deverá informar chaves de infraestrutura nem acessar diretamente buckets, bancos, volumes ou máquinas do Cofre.

### Etapa 2 — Preparação e proteção local

O Curador seleciona localmente somente os arquivos permitidos. O cliente confiável gera o manifesto, valida a lista de arquivos, assina e cifra o pacote antes que ele deixe o equipamento.

O conteúdo não deve ser copiado para conversa com modelo de IA nem enviado em claro para uma página controlada pela mesma infraestrutura.

O Curador informa somente metadados permitidos, como finalidade e versão pretendida.

O sistema deve impor limites de tamanho, quantidade, extensão, formato e tempo de envio. A credencial de transmissão deve ser temporária, vinculada ao Curador, válida para uma única operação e protegida contra repetição.

### Etapa 3 — Quarentena

Após o recebimento, o pacote fica indisponível para execução. Ele é mantido em área de quarentena, com identificador opaco e sem acesso do Operador ao conteúdo.

### Etapa 4 — Validação automática protegida

O sistema valida, dentro da fronteira protegida e sem serviços públicos de análise, no mínimo:

- formato e estrutura;
- integridade e checksum;
- assinatura e proveniência;
- limites de tamanho e complexidade;
- presença de arquivos proibidos;
- malware e conteúdo executável não autorizado;
- compatibilidade com a versão do motor;
- ausência de tentativa de acesso externo indevido.

Na primeira versão, devem ser aceitos somente formatos declarativos explicitamente aprovados. Macros, scripts, binários, bibliotecas incorporadas e outros executáveis ficam proibidos.

Falhas devem interromper o fluxo e retornar código/motivo seguro, sem expor conteúdo ou stack trace.

### Etapa 5 — Versionamento e aprovação

Se aprovado pelos controles definidos, o pacote recebe uma versão imutável e uma referência opaca.

Quando o risco exigir aprovação humana, o pacote permanece pendente até a decisão do aprovador designado. O Operador não deve aprovar o próprio pacote nem alterar o conteúdo recebido.

### Etapa 6 — Armazenamento protegido

O pacote é armazenado cifrado. As chaves devem ser administradas por KMS/HSM ou mecanismo equivalente aprovado no Gate 0, sem exportação para o Curador, Operador ou FD-Core. A identidade administrativa da infraestrutura não pode, isoladamente, solicitar a descriptografia.

O armazenamento não deve oferecer acesso direto por interface administrativa comum.

### Etapa 7 — Execução isolada e verificada

Quando uma execução autorizada for solicitada, o sistema cria um executor altamente isolado, preferencialmente uma microVM ou VM dedicada conforme o threat model. O serviço de chaves só libera material temporário para ambiente, código e execução previamente autorizados/atestados.

O executor recebe somente o pacote e os dados mínimos necessários à tarefa. Rede, filesystem, memória, CPU, tempo de execução e permissões devem ser restritos.

### Etapa 8 — Processamento e resultado

O executor processa o pacote e devolve somente o resultado autorizado pelo contrato. O resultado não deve conter o pacote, plaintext, chaves, instruções internas ou metadados protegidos.

### Etapa 9 — Descarte e auditoria

Ao concluir ou interromper a execução, o executor deve ser destruído ou limpo conforme a garantia definida no Gate 0.

O sistema registra eventos de auditoria sem registrar o conteúdo protegido: recebimento, validação, aprovação, publicação, execução, conclusão, falha e descarte.

## 7. Comportamentos de erro

O sistema deve rejeitar ou interromper o fluxo quando ocorrer:

- Curador não autenticado ou sem permissão;
- pacote acima dos limites;
- formato inválido;
- checksum ou assinatura inválidos;
- pacote malicioso ou incompatível;
- tentativa de rede ou execução proibida;
- falha de isolamento;
- chave ou armazenamento indisponível;
- timeout ou consumo acima do limite;
- tentativa de acesso do Operador ao conteúdo protegido.

Em todos os casos, a interface deverá exibir estado e motivo seguro, nunca o conteúdo do pacote, chaves ou detalhes internos de infraestrutura.

## 8. Garantias de segregação

| Ator/componente | Pode fazer | Não pode fazer |
|---|---|---|
| Curador | enviar e acompanhar seu pacote autorizado | acessar armazenamento bruto, chaves ou executor |
| Operador | acompanhar estados, resultados e métricas | visualizar ou editar o conteúdo enviado |
| FD-Core | solicitar processamento por referência opaca | receber plaintext ou acessar o pacote completo |
| Cofre | custodiar pacotes cifrados e controlar referências | expor conteúdo por interface externa |
| Executor | processar dentro do escopo autorizado | acessar rede, chaves exportáveis ou outros pacotes |
| Aprovador | aprovar, rejeitar ou revogar versões | alterar silenciosamente o pacote recebido |

## 9. Controles de segurança obrigatórios

- autenticação forte do Curador e do Operador;
- autorização por função e escopo;
- upload cifrado em trânsito e repouso;
- quarentena antes da execução;
- assinatura, checksum e proveniência;
- versionamento imutável e revogação;
- KMS/HSM sem exportação de chaves;
- executor em microVM/VM ou isolamento aprovado pelo threat model;
- rede e filesystem restritos;
- limites de tamanho, tempo, memória e CPU;
- logs sanitizados e trilha de auditoria;
- scanner de malware, segredos e dependências;
- testes negativos e red team independente;
- rollback, descarte e resposta a incidentes.

## 10. O que precisa ser decidido pelo Curador/cliente

1. Quais tipos de arquivo podem ser enviados?
2. O pacote representa configuração, conhecimento versionado, regras, prompts ou outro artefato?
3. O envio deve ser publicado automaticamente após a validação ou exigir aprovação humana?
4. Quais tamanhos, quantidades e frequências são permitidos?
5. Quais resultados o Curador e o Operador podem visualizar?
6. Por quanto tempo os pacotes e seus metadados devem ser retidos?
7. O Curador pode substituir uma versão ou somente criar uma nova?
8. Quem pode revogar ou fazer rollback?
9. Qual ameaça o isolamento precisa suportar?
10. Há requisitos regulatórios, jurisdicionais ou contratuais?
11. O motor executará regras determinísticas, prompts, conhecimento recuperável ou modelo treinado?
12. O que acontece quando a validação ou execução falha parcialmente?

## 11. Critérios de aceite preliminares

- [ ] Curador autenticado consegue enviar pacote permitido sem intervenção do Operador.
- [ ] Pacote recebido recebe referência opaca e fica em quarentena.
- [ ] Pacote inválido é rejeitado sem vazamento de conteúdo.
- [ ] Pacote aprovado é versionado e armazenado cifrado.
- [ ] Executor recebe somente o pacote autorizado e os dados mínimos.
- [ ] Execução ocorre em isolamento alto conforme decisão do Gate 0.
- [ ] Operador acompanha estados e resultados sem acessar o pacote.
- [ ] Resultado externo contém somente dados autorizados.
- [ ] Logs e auditoria não contêm plaintext, chaves ou conteúdo protegido.
- [ ] Executor é descartado conforme a política definida.
- [ ] Falhas possuem códigos, estados e procedimentos de recuperação.
- [ ] Testes Red → Green → Refactor, regressão e revisão independente possuem evidência.

## 12. Limites desta proposta

Esta proposta não define ainda:

- provedor de nuvem;
- banco ou armazenamento específico;
- tecnologia final de microVM/VM;
- algoritmo criptográfico;
- fornecedor de KMS/HSM;
- modelo de IA;
- política definitiva de retenção;
- autorização para produção.

Essas decisões devem entrar no `plan.md` da feature correspondente somente depois da clarificação e aprovação do requisito.

## 13. Aprovação

### Decisão do Curador

- [ ] Aprovado sem alterações.
- [ ] Aprovado com alterações registradas abaixo.
- [ ] Rejeitado para reformulação.

### Observações do Curador

_Preencher durante a revisão._

### Responsável e data

**Nome:** ____________________________________

**Data:** ____________________________________

**Assinatura/registro:** ______________________

## Adendo obrigatório após parecer do cliente

O parecer aprovou a direção do fluxo com alterações obrigatórias. A proteção deve começar no ambiente do Curador: o pacote deve ser selecionado por um cliente local confiável, receber manifesto, assinatura e cifragem antes de deixar o equipamento. O conteúdo não deve entrar em conversa com modelo de IA nem ser enviado em claro para uma página web controlada pela mesma infraestrutura.

O Operador não pode ter capacidade administrativa isolada de descriptografar. A liberação de chaves deve depender de executor, código e ambiente autorizados/verificados; alterações não aprovadas devem invalidar a autorização. Não pode existir uma única credencial que administre a infraestrutura e descriptografe o conteúdo.

Na primeira versão, somente formatos declarativos explicitamente aprovados serão aceitos. Macros, scripts, binários, bibliotecas incorporadas e credenciais permanentes ficam proibidos. Scanners devem operar localmente ou dentro da fronteira protegida, nunca por serviços públicos. Backups, réplicas, snapshots, memória e descarte precisam de política e evidência próprias.

Este adendo prevalece sobre qualquer trecho anterior que trate a ausência de acesso na interface como garantia suficiente.

## Registro da aprovação

**Decisão:** proposta aprovada pelo Curador.

**Data do registro:** 2026-09-09.

**Condição:** a aprovação valida o requisito e o fluxo proposto; não autoriza ainda implementação produtiva, dados reais, escolha irreversível de provedor ou fechamento do Gate 0.

## Decisões de clarificação

### CLARIFY-001 — Escopo do pacote na primeira versão

**Decisão aprovada:** a primeira versão aceitará somente arquivos declarativos de configuração, regras e conhecimento versionado.

**Ficam proibidos nesta versão:** scripts, binários, macros, bibliotecas incorporadas, executáveis e treinamento ou alteração permanente de modelo.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-005 — Retenção de pacotes rejeitados e temporários

**Decisão aprovada:** pacotes rejeitados e arquivos temporários serão excluídos automaticamente após 24 horas, salvo retenção legal ou investigação ativa.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-004 — Local de processamento

**Decisão aprovada:** o processamento deverá ocorrer integralmente dentro do Cofre. O pacote protegido não será enviado a APIs externas, modelos externos ou provedores de processamento fora da fronteira aprovada.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-003 — Separação entre Curador e Aprovador

**Decisão aprovada:** na sandbox sintética, o Curador poderá aprovar o próprio pacote para fins de demonstração. Qualquer publicação produtiva exigirá aprovador humano independente.

**Controles da exceção:** a sandbox não poderá receber dados reais; a validação automática permanecerá obrigatória; a decisão deverá ser registrada em auditoria; a exceção não poderá ser promovida automaticamente para produção.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-002 — Publicação do pacote

**Decisão aprovada:** a validação automática será obrigatória, mas não publicará o pacote sozinha. A publicação exigirá aprovação humana explícita.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-006 — Retenção de versões aprovadas

**Decisão aprovada:** a versão aprovada e ativa será mantida até sua revogação. As versões históricas aprovadas serão mantidas por 90 dias para auditoria e rollback controlado.

**Requisitos de controle:** a revogação deverá ser explícita, registrada em auditoria e impedir novas execuções da versão revogada. A retenção histórica não autoriza publicação automática nem acesso ao conteúdo por operadores não autorizados.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.

### CLARIFY-007 — Autoridade para revogação

**Decisão aprovada:** o Curador poderá revogar diretamente uma versão publicada, sem segunda aprovação.

**Controles obrigatórios:** toda revogação deverá ser explícita, registrada em auditoria e bloquear efetivamente novas execuções da versão revogada. A revogação direta não concede ao Curador acesso ao conteúdo protegido nem permite alterar os registros históricos.

**Responsável pela decisão:** Curador.

**Data:** 2026-09-09.
