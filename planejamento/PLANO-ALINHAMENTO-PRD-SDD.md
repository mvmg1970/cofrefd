# Plano de Alinhamento PRD + SDD — Cofre Flexdomini

**Data:** 2026-09-09
**Status:** Plano de trabalho — requer aprovação humana antes da execução
**Classificação atual:** protótipo experimental pré-Gate 0

## 1. Conclusão executiva

O repositório já demonstra um thin slice full-stack sintético: domínio, API estreita em processo, custódia em memória, UI local, testes de segurança e build reproduzível. Isso está alinhado com a regra do PRD de experimentar antes do Gate 0 sem usar dados reais.

Ainda não existe o Cofre de produção. O trabalho restante precisa ser executado em fatias verticais, cada uma com spec, clarify, plan, checklist, tasks, analyze, teste Red, implementação Green, refactor, validação automatizada e aprovação humana.

Nenhuma fase abaixo autoriza dados reais ou promoção a produção antes do fechamento formal do Gate 0.

### Terceira fonte de verdade: parecer do cliente

O parecer técnico de 09/09/2026 complementa o PRD e o livro SDD. Quando detalha o fluxo protegido, ele exige: cliente local confiável, cifragem e assinatura antes da transmissão, impossibilidade técnica de descriptografia administrativa, atestação do executor, formatos declarativos mínimos, scanners dentro da fronteira e descarte/backup comprováveis. Essas exigências devem ser incorporadas à spec antes da implementação.

## 2. Estado atual e lacunas

### Concluído como protótipo

- contratos de domínio e `Result` tipado;
- processamento sintético por referência opaca;
- repositório volátil em memória;
- API estreita em processo;
- sanitização/testes de logs e exfiltração;
- UI local demonstrável;
- 21 testes aprovados, type-check e build aprovados;
- dependências auditadas sem vulnerabilidades conhecidas;
- commits separados para UI, dependências, thin slice e evidências.

### Não implementado

- API HTTP real e autenticação;
- separação física entre custódia e executor;
- KMS/HSM e criptografia de produção;
- versionamento, assinatura e aprovação de pacotes;
- IAM, multi-tenant e autorização operacional;
- trilha de auditoria confiável;
- limpeza forense e garantia de memória efêmera;
- observabilidade, SLO, RTO, RPO e operação;
- red team independente e revisão de segurança independente;
- fechamento do Gate 0.

## 3. Portão 0 — decisões que precisam ser fechadas antes de produção

Estas decisões são P0 e devem possuir owner humano, decisão registrada, evidência e risco residual:

1. nível de isolamento necessário para o executor;
2. dados, jurisdições e limites do piloto;
3. RTO, RPO, SLO, orçamento e limites de custo;
4. métricas de equivalência entre modelos, quando aplicável;
5. classificação de decisões de alto impacto e pontos de intervenção humana;
6. responsáveis humanos por curadoria, operação, segurança, aprovação e incidentes;
7. provedores, stack e dependências autorizados para o thin slice produtivo;
8. definição formal do WINDU e seus limites de autoridade;
9. política de execução dos agentes: ferramentas, diretórios, branches, rede, custos e stop conditions;
10. política de credenciais, segredos, proveniência, licenças e artefatos entre agentes.

**Critério de saída:** ata de fechamento aprovada pelo responsável humano, com decisões, owners, evidências, riscos aceitos e itens explicitamente adiados.

## 4. Ordem recomendada de execução

### Fase 0 — Governança e preparação

**Objetivo:** tornar o processo e as decisões auditáveis antes de ampliar o produto.

Entregas:

- backlog priorizado pelo cliente;
- política de execução dos agentes;
- definição de owners humanos e revisor independente;
- proteção de branch principal e fluxo de revisão;
- convenção de evidências e retenção de relatórios;
- decisão sobre os artefatos `.agents/` e `.specify/` ainda não rastreados.

**Saída:** nenhuma implementação nova até que as decisões necessárias estejam registradas.

### Fase 1 — Contrato de produto e API estreita real

**Objetivo:** transformar a API em uma fronteira de transporte testável, sem expor conteúdo protegido.

Entregas:

- especificação funcional da solicitação e resposta;
- contrato HTTP ou adaptador equivalente, incluindo autenticação e correlação segura;
- validação de entrada, limites, idempotência e timeouts;
- mapeamento de erros tipados para respostas externas;
- testes negativos de exfiltração, replay, entrada inválida e excesso de tamanho;
- documentação OpenAPI somente depois que o contrato estiver aprovado.

**Critério de saída:** cliente externo recebe apenas referência opaca, estado permitido e veredito/erro tipado; nenhuma resposta contém plaintext, chave, payload ou stack trace.

### Fase 2 — Custódia, executor e criptografia

**Objetivo:** substituir as simulações de processo por fronteiras reais e demonstráveis.

Entregas:

- serviço de custódia separado do executor;
- executor efêmero em isolamento definido no Gate 0;
- pacotes lógicos versionados, assinados e autorizados;
- KMS/HSM definido e integrado sem exportação de chaves;
- descriptografia somente no contexto autorizado do executor;
- limpeza, descarte e evidência de memória/tempestividade;
- testes de boundary, escape, acesso indevido e falha segura.

**Critério de saída:** nenhum componente isolado consegue reconstruir o conteúdo protegido completo; a alegação de isolamento possui teste, inspeção e revisão independente.

### Fase 3 — Governança de acesso e curadoria

**Objetivo:** implementar o fluxo correto indicado pelo PRD.

Fluxo-alvo:

`Curador → curadoria/aprovação → FD-Core → API estreita → Cofre → executor`

Entregas:

- identidade e autorização por função;
- curadoria, aprovação e dupla revisão para pacotes sensíveis;
- versionamento, rollback e revogação;
- trilha de auditoria imutável e sem conteúdo protegido;
- separação entre operador, aprovador, revisor e executor;
- controles para decisões de alto impacto.

**Critério de saída:** não existe caminho de acesso direto do Curador ao armazenamento protegido nem bypass da aprovação.

### Fase 4 — Segurança operacional e observabilidade

**Objetivo:** provar que a solução pode ser operada com limites e resposta a incidentes.

Entregas:

- gestão de segredos e rotação;
- scanner de segredos e dependências no CI;
- logs estruturados, sanitizados e com retenção definida;
- métricas, alertas, SLO, RTO e RPO;
- runbooks de incidente, revogação e descarte;
- testes de restauração, degradação, rate limit e indisponibilidade;
- red team independente.

**Critério de saída:** incidentes previsíveis possuem detecção, contenção, responsável e procedimento exercitado.

### Fase 5 — Piloto controlado e Gate de produção

**Objetivo:** somente após as fases anteriores, avaliar um piloto limitado.

Entregas:

- dados e jurisdições aprovados;
- threat model e revisão independente fechados;
- critérios de sucesso e abortamento;
- aprovação humana formal do piloto;
- plano de rollback e descarte;
- relatório de equivalência/qualidade dos modelos, quando aplicável;
- decisão explícita de promoção, adiamento ou descarte.

**Critério de saída:** Gate 0 fechado e autorização separada para piloto; nenhum protótipo anterior é promovido automaticamente.

## 5. Regra SDD obrigatória para cada nova fase

Cada entrega futura deve possuir uma pasta própria e seguir esta sequência:

1. **Constitution:** confirmar princípios e restrições aplicáveis.
2. **Specify:** escrever problema, escopo, não-objetivos, EARS, cenários Given/When/Then, contratos e invariantes.
3. **Clarify:** resolver ambiguidades com o responsável humano.
4. **Plan:** registrar arquitetura, dependências, riscos, alternativas e decisões técnicas.
5. **Checklist:** conferir completude da spec e do plan.
6. **Tasks:** dividir em incrementos pequenos, ordenados e verificáveis.
7. **Analyze:** verificar conflitos, lacunas e excesso entre spec, plan e tasks.
8. **Implement:** executar cada tarefa com teste Red antes do código.
9. **Testes:** obter Green, refatorar e rodar regressão completa.
10. **Validação manual:** revisar o comportamento observável, segurança e critérios de aceite.
11. **Integração controlada:** stage seletivo, revisão do diff, commit pequeno e rastreável.

### Evidência mínima por incremento

- saída do teste Red antes da implementação;
- mudança mínima que obtém Green;
- saída da regressão;
- type-check, build e scanners aplicáveis;
- revisão humana registrada;
- commit com escopo explícito;
- riscos residuais e decisões adiadas documentados.

## 6. Correções de processo para o histórico atual

Não reescrever evidências retroativamente. Registrar honestamente:

- a feature 001 possui baseline sem Red histórico completo;
- as features 002 e 003 seguiram spec, testes Red/Green, regressão e revisão, mas não tiveram plan/checklist/analyze formais completos antes da implementação;
- o trabalho foi feito na `master`, embora o PRD recomende branches isoladas;
- os três commits funcionais estão separados, mas os artefatos gerais do tooling ainda precisam de decisão.

Esses pontos são dívida de processo, não motivo para fabricar evidência. A partir da próxima feature, a cadeia completa é obrigatória.

## 7. Próxima ação autorizada

Antes de implementar a Fase 0 ou qualquer nova funcionalidade, o responsável humano deve escolher o próximo requisito de negócio do backlog e aprovar uma nova spec. A pergunta ao cliente deve ser:

> Qual capacidade de negócio o Cofre deve entregar em seguida, para quem, em qual fluxo e com qual resultado observável?

Nenhum componente de produção, dado real, provedor definitivo ou decisão irreversível deve ser introduzido enquanto essa resposta e o Gate 0 permanecerem abertos.
