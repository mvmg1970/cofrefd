# Feature Specification: Hardening Operacional do Cofre

**Feature Branch**: `005-hardening-operacional-cofre`
**Created**: 2026-09-13
**Status**: Clarified — aprovada pelo Curador no Specify Gate
**Priority**: P0 — bloqueadores do Gate 0

## 1. Contexto

O parecer independente da SPEC 004 confirmou que os contratos e testes sintéticos são coerentes, mas rejeitou o fechamento do Gate 0 porque os controles de maior impacto ainda não possuem fronteira operacional comprovada. Esta feature trata exclusivamente desses bloqueadores.

## 2. Objetivo

Definir e demonstrar, em ambiente controlado e sem dados reais, as fronteiras operacionais necessárias para que o Cofre possa ser novamente avaliado: custódia de chaves, executor isolado, ingestão persistente, autorização de uso único, bloqueio de egress e descarte verificável.

## 3. Escopo

- serviço de custódia de chaves sem exportação autônoma;
- IAM separado para Curador, Operador, Administrador e executor;
- executor efêmero com isolamento real e atestação verificável;
- gateway e quarentena persistentes, com transições atômicas;
- anti-replay durável, concorrente e vinculado à solicitação;
- rede deny-by-default e testes de exfiltração em runtime;
- lifecycle de storage, backups, réplicas, snapshots, memória e resíduos;
- evidências reproduzíveis de operação, falhas, reinício e recuperação.

## 4. Fora de escopo

- uso de dados reais;
- autorização de produção ou fechamento do Gate 0;
- escolha irreversível de provedor, nuvem, KMS/HSM ou jurisdição;
- treinamento de modelo;
- publicação automática;
- remoção dos requisitos de aprovação humana;
- declaração de segurança absoluta.

## 5. Requisitos funcionais

### FR-001 — Custódia de chaves

O sistema deverá liberar material de descriptografia somente mediante política externa e verificável, vinculada à identidade do executor, hash do código/imagem, ambiente atestado, hash do pacote e solicitação única.

### FR-002 — Separação de privilégios

Administrador e Operador não deverão possuir caminho autônomo para obter plaintext, chaves privadas ou autorização de descriptografia.

### FR-003 — Executor isolado

O sistema deverá executar o pacote somente em workload efêmero, com identidade verificável, filesystem mínimo, ausência de privilégios, limites de CPU/memória/tempo e rede deny-by-default.

### FR-004 — Ingestão persistente

O gateway deverá aceitar somente envelopes protegidos válidos e persistir a quarentena com integridade, controle de acesso, atomicidade e recuperação após reinício.

### FR-005 — Validação obrigatória

Assinatura, integridade, formato, proveniência, destino, credencial e política deverão ser validados antes de qualquer publicação ou execução.

### FR-006 — Anti-replay

Cada solicitação de liberação deverá possuir identificador único, audiência, expiração e registro durável de uso único, com comportamento seguro sob concorrência e reinício.

### FR-007 — Egress

O executor deverá bloquear egress por padrão e produzir evidência de testes contra HTTP, DNS, IPv6, proxy, sockets, subprocessos e endpoints de metadados quando aplicável.

### FR-008 — Descarte verificável

O lifecycle deverá aplicar as políticas de 24 horas, retenção legal/investigação, histórico de 90 dias e ativo até revogação a storage, backups, réplicas, snapshots, memória, chaves e resíduos.

### FR-009 — Auditoria operacional

Eventos de ingestão, validação, autorização, execução, falha, descarte e revogação deverão ser registrados sem plaintext, chaves ou caminhos sensíveis, incluindo correlação e resultado verificável.

### FR-010 — Falhas seguras

Falhas de attestation, custódia, rede, persistência, concorrência, integridade ou descarte deverão bloquear a progressão e não poderão produzir publicação ou execução parcial.

## 6. Cenários de aceite

### SC-001 — Administrador tenta obter plaintext

**Dado** um Administrador com acesso operacional, **quando** solicitar descriptografia fora do executor atestado, **então** a autorização deverá ser negada e o evento sanitizado deverá ser auditado.

### SC-002 — Executor alterado

**Dado** um pacote autorizado, **quando** o hash do código, imagem ou ambiente divergir, **então** a custódia deverá negar a liberação e nenhuma execução deverá ocorrer.

### SC-003 — Replay concorrente

**Dado** um identificador de solicitação usado simultaneamente em dois pedidos, **quando** ambos forem processados, **então** no máximo um deverá obter autorização.

### SC-004 — Tentativa de exfiltração

**Dado** um workload em execução, **quando** tentar egress por qualquer canal testado, **então** a transmissão deverá ser bloqueada e o evento deverá ser registrado sem conteúdo protegido.

### SC-005 — Reinício durante ingestão

**Dado** um reinício entre recebimento, validação e publicação, **quando** o serviço retornar, **então** não poderá haver publicação ou execução sem validação e aprovação completas.

### SC-006 — Expiração e retenção

**Dado** um pacote expirado sem retenção legal, **quando** o lifecycle executar, **então** o pacote e suas cópias cobertas deverão ser descartados com evidência verificável.

## 7. Invariantes

- Gate 0 permanece aberto durante toda esta feature.
- Nenhum dado real ou segredo real será utilizado.
- Nenhuma chave privada será armazenada em código, teste ou log.
- Nenhum Administrador ou Operador poderá descriptografar autonomamente.
- Nenhuma falha poderá promover, publicar ou executar um pacote.
- Toda evidência deverá identificar ambiente, versão, comando e resultado.

## 8. Decisões pendentes

Antes do planejamento, o Curador deverá aprovar ou registrar como pendentes: tecnologia de isolamento, mecanismo de attestation, classe de KMS/HSM para ambiente sintético, persistência, modelo de IAM, política de rede, estratégia de backups/snapshots, ambiente de execução e critérios de equivalência produtiva.

## 9. Rastreabilidade

- **PRD:** fronteira do Cofre, FD-Core, executor, KMS/HSM, API estreita e Gate 0.
- **SDD:** nova feature após parecer independente, com Specify, Clarify, Plan, Checklist, Tasks, Analyze e implementação Red → Green → Refactor.
- **Parecer do cliente:** proteção pré-transmissão, Operador sem descriptografia, executor atestado, scanners internos e descarte verificável.
- **Parecer independente:** C-001, C-002, A-001, A-002, A-003, M-001, M-002 e B-001.

## 10. Critério do Specify Gate

Esta SPEC somente poderá avançar quando o Curador confirmar que o objetivo, o escopo, os requisitos, os cenários, as invariantes e as decisões pendentes representam corretamente a próxima etapa, sem autorizar produção ou dados reais.

## 11. Registro do Specify Gate

**Decisão:** especificação aprovada pelo Curador/responsável pelo produto.

**Data da aprovação:** 13/09/2026.

**Próximo passo autorizado:** clarificar as decisões técnicas pendentes antes do Plan Gate.

**Limite da decisão:** esta aprovação não autoriza produção, uso de dados reais, escolha irreversível de provedor ou fechamento do Gate 0.
