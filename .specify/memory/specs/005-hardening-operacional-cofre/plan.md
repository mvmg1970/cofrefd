# Implementation Plan: Hardening Operacional do Cofre

**Branch:** `005-hardening-operacional-cofre`
**Spec:** `spec.md`
**Data:** 2026-09-13
**Status:** Aprovado — Plan Gate concluído pelo Curador

## 1. Objetivo técnico

Transformar os requisitos aprovados da SPEC 005 em uma arquitetura operacional sintética, executável em Linux nativo dedicado, usando microVM, TPM/measured boot, emulador local de KMS/HSM, SQLite com WAL, firewall deny-by-default, cópias sintéticas cifradas e identidades separadas com mTLS.

Este plano não autoriza produção, dados reais ou fechamento do Gate 0. Também não escolhe provedor produtivo nem trata emulação como equivalente de hardware, nuvem ou serviço gerenciado.

## 2. Decisões técnicas aprovadas

| Código | Decisão | Limite |
|---|---|---|
| DT-001 | MicroVM como fronteira do executor | protótipo operacional, não produção |
| DT-002 | TPM/measured boot para attestation | verificador e política ainda devem ser implementados |
| DT-003 | Emulador local KMS/HSM sem exportação | não comprova custódia física/produtiva |
| DT-004 | SQLite com WAL e arquivo protegido | não equivale a storage distribuído |
| DT-005 | Firewall deny-by-default com allowlist | comunicação externa não autorizada por padrão |
| DT-006 | Cópias sintéticas cifradas com lifecycle | sem dados reais ou retenção produtiva |
| DT-007 | Identidades por serviço e mTLS interno | não equivale a IAM produtivo |
| DT-008 | Linux nativo dedicado | host de laboratório, não produção |

## 3. Componentes e responsabilidades

| Componente | Responsabilidade | Não pode fazer |
|---|---|---|
| Host Linux dedicado | fornecer baseline, kernel, TPM e runtime | armazenar plaintext fora do escopo autorizado |
| Orquestrador de microVM | criar, medir, atestar e destruir workload | liberar chave sem política aprovada |
| Verificador de attestation | conferir measured boot, imagem e código | aceitar relatório ausente, expirado ou divergente |
| Emulador KMS/HSM | custodiar chaves do laboratório e emitir autorização | exportar chave privada ou aceitar papel indevido |
| Gateway de ingestão | receber envelope, validar credencial e persistir quarentena | descriptografar ou publicar |
| SQLite protegido | armazenar estados, nonce, auditoria e metadados mínimos | receber plaintext ou permitir transição não atômica |
| Firewall/proxy de laboratório | aplicar deny-by-default e allowlist | liberar egress implícito |
| Executor atestado | processar pacote autorizado dentro da microVM | acessar host, rede não permitida ou credenciais externas |
| Lifecycle worker | tratar retenção e descarte de dados e cópias | ignorar hold legal/investigação |
| Auditoria sanitizada | registrar eventos e correlação sem conteúdo protegido | registrar plaintext, chaves ou caminhos sensíveis |

## 4. Fluxo operacional planejado

```text
cliente local
  → gateway mTLS
  → validação de destino/credencial/assinatura/integridade
  → quarentena SQLite atômica
  → scanner interno
  → aprovação humana
  → solicitação única ao verificador de attestation
  → autorização do emulador KMS/HSM
  → microVM sem privilégios
  → execução com firewall deny-by-default
  → auditoria sanitizada
  → descarte/lifecycle verificável
```

Qualquer falha deverá interromper o fluxo, manter o pacote fora de publicação/execução e registrar somente um evento sanitizado.

## 5. Fronteiras de segurança

### 5.1 Custódia

O emulador deverá expor apenas operações de uso controlado, nunca exportação autônoma de chaves. A autorização deverá comparar executor, código, imagem, ambiente, pacote, solicitação única, audiência e expiração.

### 5.2 Executor

A microVM deverá ser criada com imagem imutável, filesystem mínimo e efêmero, ausência de privilégios, limites de CPU/memória/tempo e identidade mensurada. O argumento da operação deverá ser efetivamente processado no workload de laboratório; nenhum resultado sintético poderá ser fabricado por um objeto de configuração.

### 5.3 Rede

O firewall deverá negar por padrão. A allowlist deverá ser explícita, versionada e testada contra HTTP, DNS, IPv4/IPv6, proxy, sockets, subprocessos e endpoints de metadados. O laboratório não deverá enviar conteúdo a modelos, APIs ou provedores externos.

### 5.4 Persistência e anti-replay

As transições deverão ser transacionais e idempotentes no SQLite WAL. O nonce/request ID deverá ser reservado atomicamente antes da liberação de chave, com TTL, audiência e vínculo ao pacote e ao executor. Os testes deverão cobrir concorrência e reinício.

### 5.5 Lifecycle

O worker deverá processar pacotes, cópias, chaves temporárias, memória e resíduos segundo as políticas aprovadas: descarte após 24 horas quando aplicável, retenção legal/investigação como exceção, histórico aprovado por 90 dias e ativo até revogação.

## 6. Estratégia Red → Green → Refactor

- escrever testes de contrato e falha antes de cada componente;
- começar por interfaces de custódia, attestation, storage e firewall;
- implementar o caminho mínimo seguro em ambiente sintético;
- testar negação antes do caminho positivo;
- integrar os componentes somente após os testes unitários passarem;
- executar testes de reinício, concorrência, egress, escape e descarte;
- refatorar sem ampliar o escopo nem remover controles negativos.

## 7. Estratégia de evidências

Cada controle deverá possuir evidência com versão do código, ambiente Linux, configuração, comando, resultado e classificação:

1. implementado no código;
2. demonstrado no laboratório controlado;
3. comprovado em ambiente produtivo equivalente.

Nenhum resultado da categoria 1 ou 2 poderá ser registrado como categoria 3.

## 8. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| TPM indisponível no laboratório | declarar bloqueio; não substituir silenciosamente por flag booleana |
| microVM com escape ou privilégio excessivo | testes de escape, inspeção de configuração e revisão independente |
| emulador confundido com KMS/HSM real | nomenclatura, interfaces e relatórios distinguindo laboratório de produção |
| replay concorrente | reserva atômica no SQLite, TTL e testes multi-thread |
| egress por canal alternativo | firewall, DNS controlado e matriz de testes de rede |
| resíduos em cópias | lifecycle explícito, falhas simuladas e evidência de descarte |
| administrador obter chaves | separação de identidades, ausência de exportação e testes negativos |
| falha parcial publicar pacote | transações, estados monotônicos e recuperação após reinício |

## 9. Dependências e decisões ainda abertas

O plano depende da aprovação do Checklist Gate e do Tasks Gate. Ainda deverão ser detalhados antes do código: runtime de microVM, formato do relatório TPM, biblioteca de mTLS, esquema SQLite, ferramenta de firewall, formato das cópias sintéticas, política de backup do laboratório, observabilidade e critérios de equivalência produtiva.

## 10. Critério de saída do Plan Gate

O Plan Gate será concluído quando este plano for aprovado pelo Curador e todas as decisões técnicas necessárias à primeira tarefa forem classificadas como aprovadas, pendentes ou bloqueadas, com componente, dependência, teste e evidência esperada. Nenhum código deverá ser implementado antes do Checklist, Tasks e Analyze Gates.

## 11. Registro do Plan Gate

**Decisão:** plano aprovado pelo Curador/responsável pelo produto.

**Data da aprovação:** 13/09/2026.

**Próximo passo autorizado:** criar e revisar o Checklist Gate da SPEC 005.

**Limite da decisão:** a aprovação não autoriza implementação, produção, uso de dados reais ou fechamento do Gate 0.
