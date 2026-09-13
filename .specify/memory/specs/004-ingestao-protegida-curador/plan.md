# Implementation Plan: Ingestão Protegida do Curador

**Branch:** `004-ingestao-protegida-curador`
**Spec:** `.specify/memory/specs/004-ingestao-protegida-curador/spec.md`
**Data:** 2026-09-10
**Status:** Aprovado — Plan Gate concluído pelo Curador

## 1. Objetivo técnico

Transformar os requisitos aprovados da ingestão protegida em uma arquitetura verificável, mantendo a separação entre o cliente local do Curador, a fronteira do Cofre, a quarentena, a validação, a aprovação, a publicação e o executor interno.

Este plano não implementa o fluxo. Ele define a ordem de trabalho, os limites técnicos, as decisões ainda abertas e a estratégia de validação para a fase seguinte.

## 2. Restrições não negociáveis

- Nenhum dado real ou segredo real será utilizado antes do fechamento do Gate 0.
- O cliente local deverá cifrar e assinar antes de qualquer transmissão.
- O conteúdo em claro não poderá entrar em UI web, logs, modelos, APIs externas ou serviços públicos.
- O processamento ocorrerá integralmente dentro da fronteira aprovada do Cofre.
- Operador e administrador de infraestrutura não terão caminho autônomo de descriptografia.
- A primeira versão aceitará apenas formatos declarativos explicitamente aprovados.
- Validação automática não equivale a publicação; aprovação humana continuará obrigatória.
- Sandbox sintética não será promovida automaticamente para produção.
- Toda decisão de provedor, KMS/HSM, jurisdição e operação deverá respeitar as decisões pendentes do PRD.

## 3. Arquitetura proposta

### 3.1 Componentes e responsabilidades

| Componente | Responsabilidade | Não pode fazer |
|---|---|---|
| Cliente local confiável | selecionar, validar, manifestar, assinar e cifrar | enviar conteúdo em claro ou para destino não aprovado |
| Gateway de entrada | receber pacote protegido e credencial temporária | descriptografar ou publicar |
| Quarentena | armazenar pacote protegido e metadados mínimos | permitir execução ou acesso ao conteúdo |
| Validador isolado | verificar estrutura, assinatura, integridade e política | enviar pacote a serviço externo |
| Serviço de aprovação | registrar aprovação humana | aprovar automaticamente ou alterar pacote |
| Repositório versionado | manter versões imutáveis e estados do ciclo de vida | sobrescrever versão publicada |
| KMS/HSM | controlar liberação de chaves conforme política | permitir descriptografia por administrador isolado |
| Executor verificado | descriptografar em memória autorizada e processar | executar código não permitido ou acessar rede externa |
| Auditoria sanitizada | registrar eventos, ator, versão, hash e decisão | registrar plaintext, chaves, caminhos sensíveis ou payload |

### 3.2 Fronteiras de confiança

1. **Ambiente do Curador:** fronteira inicial de proteção; cliente assinado e verificável.
2. **Transporte:** somente pacote cifrado, assinado e associado a credencial temporária.
3. **Cofre:** recepção, quarentena, validação, aprovação, armazenamento e execução internos.
4. **Executor:** ambiente efêmero, atestado, com rede e filesystem mínimos.
5. **Operação:** administração sem capacidade independente de descriptografar.

## 4. Estados do pacote

```text
preparado-local
  → protegido-local
  → recebido-em-quarentena
  → validando
  → rejeitado | pendente-aprovacao
  → aprovado
  → publicado
  → ativo
  → revogado
```

Regras de transição:

- somente o cliente local pode produzir `protegido-local`;
- somente validação automática bem-sucedida pode produzir `pendente-aprovacao`;
- somente aprovação humana explícita pode produzir `aprovado`;
- somente uma versão aprovada pode produzir `publicado`/`ativo`;
- o Curador pode produzir `revogado` diretamente;
- estados terminais e versões publicadas são imutáveis; alterações geram nova versão.

## 5. Decisões técnicas a resolver antes da implementação

- Formato exato do manifesto e esquema de versionamento.
- Algoritmos de assinatura e cifragem, rotação e expiração de chaves.
- Mecanismo de credencial temporária e proteção anti-replay.
- Verificação de assinatura do cliente local e lista de destinos permitidos.
- Tecnologia de quarentena e armazenamento cifrado.
- Mecanismo de atestação do executor e vínculo entre código, ambiente e chave.
- Política de rede, filesystem, memória, CPU e tempo do executor.
- Implementação de retenção de 24 horas, retenção histórica de 90 dias e exceções formais.
- Modelo de auditoria sanitizada, alertas e acesso de investigação.
- Estratégia para backups, réplicas, snapshots, memória e descarte verificável.
- Jurisdição, RTO/RPO/SLO, custo, equivalência do modelo, provedores e stack, conforme PRD.

Nenhuma dessas decisões será presumida no código antes de ser registrada na especificação ou em decisão técnica aprovada.

### DT-001 — Criptografia e assinatura da primeira implementação sintética

**Decisão aprovada pelo Curador em 2026-09-10:**

- AES-256-GCM para cifragem autenticada do conteúdo;
- Ed25519 para assinatura do manifesto/envelope;
- chave pública do Cofre para proteger a chave de sessão;
- implementação inicial exclusivamente sintética, com chaves descartáveis;
- integração produtiva com KMS/HSM permanece pendente e não é autorizada por esta decisão.

Esta decisão habilita o planejamento/implementação da T006 em ambiente controlado, mas não comprova segurança produtiva nem autoriza dados reais.

### DT-002 — Condições de liberação de chave

**Decisão aprovada pelo Curador em 2026-09-10:** a liberação da chave de sessão dependerá simultaneamente de:

- identidade do executor autorizado;
- hash do código aprovado;
- ambiente atestado e correto;
- hash do pacote aprovado;
- solicitação única e auditável;
- exclusão explícita de Administrador e Operador da capacidade autônoma de descriptografia.

Esta decisão habilita a especificação/implementação sintética da política de liberação, mas não substitui KMS/HSM produtivo, atestação real ou decisão de provedor.

### DT-003 — Retenção de cópias e resíduos

**Decisão aprovada pelo Curador em 2026-09-10:** a política de ciclo de vida será aplicada a backups, réplicas e snapshots:

- versões ativas: até revogação;
- versões históricas: 90 dias;
- pacotes rejeitados e arquivos temporários: 24 horas;
- memória volátil, chaves temporárias e resíduos de execução: descarte imediato ao finalizar;
- retenção legal ou investigação ativa: exceção formal, auditável e com prazo controlado.

Esta decisão habilita a política sintética da T024, mas não comprova descarte produtivo nem substitui a definição operacional de storage, backup e recuperação.

## 6. Sequência de implementação futura

1. **Contratos:** definir tipos para manifesto, pacote protegido, estados, validação, aprovação, publicação, revogação e auditoria.
2. **Cliente local:** implementar preparação, manifesto, assinatura, cifragem, destino permitido e credencial temporária em ambiente sintético.
3. **Entrada e quarentena:** implementar recepção de pacote protegido, anti-replay, isolamento e metadados mínimos.
4. **Validação:** implementar validadores de formato declarativo, integridade, assinatura, proveniência e política.
5. **Aprovação/publicação:** implementar aprovação humana, versionamento imutável, publicação e bloqueio de promoção automática.
6. **Execução:** implementar executor isolado/verificado e liberação condicionada de chave.
7. **Revogação/retenção:** implementar revogação direta pelo Curador, bloqueio de execução, retenções e descarte auditável.
8. **Auditoria:** implementar eventos sanitizados, alertas e trilha de investigação sem conteúdo protegido.
9. **Validação independente:** executar testes de segurança, revisão de threat model e red team antes de qualquer decisão de produção.

Cada etapa deverá seguir Red → Green → Refactor, com testes automatizados, revisão manual e evidência registrada.

## 7. Estratégia de testes

### Testes de contrato

- manifesto incompleto, inválido ou incompatível;
- assinatura ausente, inválida, expirada ou de cliente não confiável;
- pacote cifrado para destino não permitido;
- transição de estado não autorizada;
- tentativa de alterar versão imutável.

### Testes de segurança

- conteúdo em claro ausente de logs, erros, auditoria, UI e dumps;
- bloqueio de chamadas externas durante validação e execução;
- bloqueio de descriptografia por Operador/administrador;
- invalidação da chave diante de alteração do código ou ambiente;
- anti-replay de credencial temporária;
- exclusão de temporários após 24 horas;
- retenção de históricos por 90 dias e bloqueio após revogação.

### Testes operacionais

- recuperação de falha sem publicação parcial;
- auditoria de aprovação e revogação;
- backup, réplica, snapshot e descarte conforme política;
- alerta para tentativa de acesso proibido;
- evidência de limites do executor.

Todos os testes iniciais devem usar fixtures sintéticas e credenciais descartáveis.

## 8. Riscos e mitigação

| Risco | Mitigação planejada |
|---|---|
| cifragem ocorrer depois da transmissão | cliente local obrigatório e teste de captura do transporte |
| administrador obter chave | política KMS/HSM vinculada a executor atestado e separação de credenciais |
| pacote malicioso escapar da quarentena | validação isolada, formatos declarativos e ausência de execução durante validação |
| logs revelarem conteúdo | sanitização centralizada e testes de exfiltração |
| promoção acidental para produção | estados separados e aprovação independente |
| resíduos permanecerem além do prazo | job de descarte, retenção formal e evidência verificável |
| dependência externa revelar conteúdo | bloqueio de rede e testes de egress |

## 9. Evidências exigidas para encerrar o Plan Gate

- plano revisado pelo Curador;
- checklist de requisitos derivado da spec;
- tarefas ordenadas e rastreáveis;
- análise de consistência e riscos;
- matriz de rastreabilidade PRD ↔ parecer ↔ spec ↔ tarefas;
- confirmação de que nenhum código será implementado antes desses artefatos.

## 10. Critério de pronto do planejamento

O planejamento estará pronto quando todas as decisões técnicas necessárias à primeira implementação estiverem explicitamente classificadas como aprovadas, pendentes ou bloqueadas, com uma tarefa e uma evidência esperada para cada requisito da SPEC 004.

## 11. Registro do Plan Gate

**Decisão:** plano aprovado pelo Curador/responsável pelo produto.

**Data da aprovação:** 2026-09-10.

**Limite da decisão:** a aprovação autoriza a elaboração do checklist, das tarefas e da análise SDD. Não autoriza implementação, uso de dados reais, produção, escolha irreversível de provedor ou fechamento do Gate 0.
