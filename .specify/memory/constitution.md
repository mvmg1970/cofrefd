# Constituição do Cofre Flexdomini

**Versão:** 1.0.0
**Status:** ratificada pelo responsável do projeto
**Última revisão:** 2026-09-08

## Princípios fundamentais

### I. Fronteiras explícitas

O sistema MUST separar custódia, processamento, interfaces externas e governança. Nenhum componente isolado pode reconstruir o conteúdo protegido completo. As dependências entre camadas MUST apontar para contratos estáveis, e a composição SHOULD ocorrer somente na borda do sistema.

### II. Minimização de contexto

Cada participante MUST receber somente os dados necessários à sua função. Interfaces externas MUST operar com referências opacas, estados e resultados autorizados. Plaintext, chaves e conteúdo classificado MUST permanecer fora das fronteiras que não tenham autorização explícita para custodiá-los.

### III. Segurança demonstrável

Toda alegação de segurança MUST possuir um controle verificável: teste automatizado, inspeção determinística, evidência de execução ou revisão humana registrada. Declarações absolutas como “inviolável” ou “risco zero” MUST NOT ser usadas como critério de aceite.

### IV. Erro como valor

Falhas previsíveis MUST ser representadas por resultados explícitos e tipados. Exceções genéricas, stack traces ou detalhes de infraestrutura MUST NOT atravessar fronteiras externas nem compor respostas destinadas a consumidores não autorizados.

### V. Desenvolvimento guiado por testes

Comportamentos novos MUST ter testes escritos antes da implementação correspondente. Cada incremento MUST seguir Red → Green → Refactor, com evidência suficiente para demonstrar que o teste falhava antes da implementação. Requisitos de segurança MUST incluir cenários negativos e testes determinísticos de exfiltração.

### VI. Mudança na origem

Quando a implementação, teste ou análise revelar uma contradição, a correção MUST começar no artefato que define a decisão: requisito na spec, decisão técnica no plan ou ordem de execução nas tasks. Alterar somente o fim da cadeia para mascarar a contradição é proibido.

### VII. Simplicidade e descarte seguro

O trabalho anterior ao fechamento do Gate 0 MUST permanecer experimental, descartável e restrito a dados sintéticos e credenciais descartáveis. Funcionalidades fora do escopo corrente MUST ser adiadas para outra feature. Nenhuma decisão experimental MUST ser tratada como autorização para produção.

### VIII. Responsabilidade humana e segregação

Agentes virtuais podem produzir artefatos e pareceres preliminares, mas não substituem aprovação humana, revisão independente ou responsabilidade decisória. O orquestrador MUST operar somente dentro de tarefas aprovadas, contexto mínimo e limites registrados; MUST NOT alterar requisitos, aprovar o próprio trabalho ou promover código diretamente para produção.

## Padrões de trabalho

Cada feature MUST percorrer a cadeia:

1. Constitution
2. Specify
3. Clarify
4. Plan
5. Checklist
6. Tasks
7. Analyze
8. Implement
9. Testes e revisão
10. Validação manual e integração controlada

Os artefatos da cadeia MUST ser versionados junto com as decisões que justificam o código. Uma feature não pode ser declarada concluída apenas porque os testes automatizados passaram; os critérios de aceite, riscos e evidências também devem estar fechados.

## Governança

Esta constituição governa as features do repositório e prevalece em caso de conflito com decisões locais de implementação. A ratificação e qualquer emenda exigem revisão humana registrada no Git. Até a ratificação, este documento deve ser tratado como proposta e não como autorização para dados reais.
