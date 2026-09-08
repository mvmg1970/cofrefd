# Tasks: Thin Slice Sintético (P1)
**Feature Branch**: `001-thin-slice-sintetico`
**Created**: 2026-09-08
**Status**: Pending Execution
**Story Map Alignment**: Spec-to-Code Chain

Este documento estabelece a lista exata, ordenada e miúda de tarefas para a implementação da branch `001-thin-slice-sintetico`. Conforme o princípio de Desenvolvimento Guiado por Testes (TDD) e a governança de segurança do Gate 0, cada etapa de implementação de código de produção é obrigatoriamente precedida por seu respectivo teste automatizado que deve, inicialmente, acusar falha (vermelho).

---

## 📋 Lista de Execução (Tasks)

### Fase 1: Fundação, Tipos e Erro como Valor (Domínio)

- [ ] **T001**: Definir a estrutura genérica de Erro como Valor `Result<S, F>` no domínio.
  - *Detalhe*: Criar os tipos de união discriminada por `kind` (`success` e `failure`) para garantir tratamento exaustivo pelo TypeScript, evitando o uso de exceções (`throw`) entre camadas.
  - *Arquivo*: `src/domain/result.ts`

- [ ] **T002**: Definir os tipos de falhas previsíveis de segurança (`ExecutionFailure`).
  - *Detalhe*: Mapear as falhas explícitas, como `task-not-found` (política inexistente), `unauthorized-signature` (violação de integridade do pacote lógico) e `exfiltration-risk-detected` (interrupção crítica do fluxo).
  - *Arquivo*: `src/domain/failures/execution-failure.ts`

- [ ] **T003**: Definir a entidade do Ativo Sintético e o contrato do Repositório.
  - *Detalhe*: Modelar a entidade `SyntheticAsset` contendo apenas propriedades lógicas necessárias (como `id`, `opaqueReference`, `status`) e definir a interface `SyntheticAssetRepository` (porta de dados), garantindo que o domínio permaneça agnóstico a bancos de dados.
  - *Arquivos*: `src/domain/entities/synthetic-asset.ts` e `src/domain/repositories/synthetic-asset-repository.ts`

---

### Fase 2: Testes e Lógica de Negócio Isolada (Use Case)

- [ ] **T004**: Escrever testes de unidade para o use case de processamento seguro (falha primeiro).
  - *Detalhe*: O teste deve tentar processar ativos simulados usando referências opacas e validar se o retorno segue o contrato `Result`. Deve garantir que se o ativo não for encontrado ou tiver assinatura corrompida, o fluxo é bloqueado com erro tipado.
  - *Arquivo*: `test/domain/process-opaque-asset.test.ts`

- [ ] **T005**: Implementar o use case `ProcessOpaqueAsset` para fazer os testes de T004 passarem (verde).
  - *Detalhe*: Escrever a regra de negócio em TypeScript puro, livre de dependências de framework ou bibliotecas de UI, validando as permissões e efetuando a transformação imutável de estado.
  - *Arquivo*: `src/domain/usecases/process-opaque-asset.ts`

---

### Fase 3: Garantias de Segurança e Testes de Exfiltração (Sandbox)

- [ ] **T006**: Escrever os testes determinísticos de exfiltração (falha primeiro).
  - *Detalhe*: Desenvolver cenários de segurança que interceptam ativamente saídas de depuração e logs do sistema (`console.log`, `console.error`) e capturam buffers de memória durante simulações de fluxo normal e de falha catastrófica. O teste de exfiltração deve falhar caso qualquer plaintext ou metadado sensível das fixtures sintéticas escape por essas saídas.
  - *Arquivo*: `test/security/exfiltration.test.ts`

- [ ] **T007**: Implementar interceptores e filtros de contenção de logs para passar os testes de T006 (verde).
  - *Detalhe*: Codificar as salvaguardas no executor efêmero de sandbox, sanitizando qualquer saída e garantindo que dumps e erros tipados não revelem dados estruturais do núcleo (FD-Core) ou referências confidenciais.
  - *Arquivo*: `src/infrastructure/security/log-sanitizer.ts`

---

### Fase 4: Infraestrutura de Teste (Dados Sintéticos)

- [ ] **T008**: Escrever testes para o repositório em memória de dados sintéticos (falha primeiro).
  - *Detalhe*: Validar que o repositório só serve fixtures mockadas pré-configuradas e bloqueia imediatamente se credenciais de produção ou conexões de rede ativas forem fornecidas.
  - *Arquivo*: `test/infrastructure/in-memory-synthetic-repository.test.ts`

- [ ] **T009**: Implementar `InMemorySyntheticAssetRepository` para passar T008 (verde).
  - *Detalhe*: Desenvolver o mock estável para servir de banco de dados volátil local durante as simulações da sandbox, livre de persistência de disco ou dependência externa de nuvem.
  - *Arquivo*: `src/infrastructure/repositories/in-memory-synthetic-repository.ts`

---

### Fase 5: Apresentação e API Estreita (Narrow API)

- [ ] **T010**: Escrever testes de integração para a Store/API Estreita que faz o FD-Core solicitar processamento (falha primeiro).
  - *Detalhe*: Validar a troca de estado na store de visualização de sessão e a correta intermediação das mensagens de sucesso e falha tipada nas bordas de integração.
  - *Arquivo*: `test/presentation/sandbox-store.test.ts`

- [ ] **T011**: Implementar a Sandbox Store e componentes de UI para passar T010 (verde).
  - *Detalhe*: Integrar os componentes de interface que expõem e gerenciam as interações da simulação do cofre em ambiente isolado.
  - *Arquivos*: `src/presentation/store/sandbox-store.ts` e `src/presentation/components/SandboxConsole.tsx`

---

### Fase 6: Validação Cruzada, Qualidade e Governança

- [ ] **T012**: Executar suíte completa de testes automatizados e análise estática de tipos.
  - *Detalhe*: Garantir que o comando `npm test` rode 100% verde (incluindo todos os testes de unidade, de integração e os determinísticos de exfiltração) e que `npm run build` termine com o type-check do TypeScript totalmente limpo.
  - *Ação*: Execução de scripts locais no terminal do VS Code.

- [ ] **T013**: Validação manual das histórias de usuário e elaboração de relatório final.
  - *Detalhe*: Rodar o app localmente em modo sandbox, simular exfiltrações e certificar-se visualmente do correto funcionamento de todos os critérios de aceitação:
    - *SC-001*: Processamento de ativo sintético via referência opaca (sucesso).
    - *SC-002*: Tentativa de exfiltração em logs bloqueada e tamanho de gravação sensível igual a zero bytes.
    - *SC-003*: Tratamento de falhas como resultado tipado e sem vazamento de stack-traces.
  - *Arquivo*: Criar `quickstart-validation.md` documentando o passo a passo da verificação humana independente.

---

## 🔍 Constitution Check de Tarefas (Audit)

Para garantir o alinhamento de integridade técnico-arquitetural:

| Task ID | Princípio Constitucional | Mecanismo de Conformidade | Status |
| :--- | :--- | :--- | :--- |
| **T001 / T002** | III. Erro como Valor | Uso obrigatório de `Result<S, F>` com tipos exaustivos. | [x] Revisado |
| **T003 / T005** | I. Arquitetura em Camadas | Domínio puro e isolado (TypeScript), independente de UI. | [x] Revisado |
| **T004 / T006** | IV. TDD / Segurança | Testes de unidade e exfiltração determinísticos escritos antes do código. | [x] Revisado |
| **T008 / T009** | V. Simplicidade (YAGNI) | Utilização estrita de dados sintéticos e sandbox isolada sem dependência física. | [x] Revisado |
