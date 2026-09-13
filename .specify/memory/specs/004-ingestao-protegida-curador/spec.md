# Feature Specification: Ingestão Protegida do Curador

**Feature Branch**: `004-ingestao-protegida-curador`
**Created**: 2026-09-09
**Status**: Clarified — aprovada pelo Curador no Specify Gate
**Priority**: P1 (pré-requisito para qualquer ingestão não sintética)

## 1. Problema e intenção

O fluxo atual é uma sandbox sintética local. Ele não oferece ao Curador um meio confiável de preparar, proteger, transmitir, validar, aprovar, publicar, revogar e reter pacotes destinados ao Cofre.

Esta feature especifica o fluxo-alvo de ingestão protegida, mantendo a fronteira de segurança definida pelo PRD, pelo livro SDD e pelo parecer técnico do cliente. A proteção deverá começar no ambiente do Curador, antes da transmissão, e o processamento deverá ocorrer integralmente dentro do Cofre.

Esta especificação não autoriza produção nem uso de dados reais. Ela é um artefato de requisitos para orientar o próximo ciclo SDD.

## 2. Escopo

### Dentro do escopo

- Cliente local confiável para seleção e preparação de pacotes.
- Manifesto, versionamento, assinatura e cifragem antes da transmissão.
- Transmissão somente para destino aprovado.
- Recepção em quarentena dentro da fronteira do Cofre.
- Validação automática de formato, integridade, assinatura, proveniência e políticas.
- Aceitação inicial somente de arquivos declarativos de configuração, regras e conhecimento versionado.
- Aprovação humana explícita antes da publicação.
- Publicação versionada, imutável e revogável.
- Execução integralmente dentro do Cofre, em executor isolado e verificado.
- Retenção, descarte e auditoria sem exposição do conteúdo protegido.

### Fora do escopo e não-objetivos

- Uso de dados reais antes do fechamento do Gate 0.
- Envio para APIs externas, modelos externos ou provedores de processamento.
- Scripts, binários, macros, bibliotecas incorporadas, executáveis ou credenciais permanentes.
- Treinamento ou alteração permanente de modelo.
- Acesso do Operador ao plaintext por interface, log, dump, suporte ou privilégio administrativo.
- Publicação automática após validação.
- Promoção automática da sandbox para produção.
- Escolha irreversível de provedor, KMS/HSM ou stack antes das decisões do PRD.

## 3. Requisitos funcionais — sintaxe EARS

### Proteção antes da transmissão

- **FR-001**: Quando o Curador preparar um pacote, o cliente local confiável MUST gerar manifesto, versão e hash do conteúdo.
- **FR-002**: Antes de qualquer transmissão, o cliente local confiável MUST assinar e cifrar o pacote.
- **FR-003**: O sistema MUST rejeitar transmissão se a assinatura, o destino ou a proteção local não puderem ser verificados.
- **FR-004**: O conteúdo em claro MUST NOT ser enviado para a página web, modelo de IA, API externa ou serviço público de análise.

### Quarentena e validação

- **FR-005**: Quando um pacote protegido chegar ao Cofre, o sistema MUST colocá-lo em quarentena antes de qualquer publicação ou execução.
- **FR-006**: A validação automática MUST verificar formato permitido, integridade, assinatura, proveniência, versão, política de conteúdo e ausência de componentes proibidos.
- **FR-007**: Se a validação falhar, o sistema MUST rejeitar o pacote, registrar apenas metadados sanitizados e impedir publicação e execução.
- **FR-008**: Scanners MUST executar localmente ou dentro da fronteira protegida; serviços públicos de análise MUST NOT receber o pacote.

### Aprovação e publicação

- **FR-009**: Um pacote validado MUST permanecer pendente até aprovação humana explícita.
- **FR-010**: Na sandbox sintética, o Curador MAY aprovar o próprio pacote somente para demonstração.
- **FR-011**: Qualquer publicação produtiva MUST exigir aprovador humano independente.
- **FR-012**: O sistema MUST publicar somente uma versão aprovada, imutável e identificável por versão e hash.
- **FR-013**: O sistema MUST NOT promover automaticamente pacote da sandbox para produção.

### Execução e revogação

- **FR-014**: O processamento MUST ocorrer integralmente dentro do Cofre, sem dependência de APIs, modelos ou provedores externos.
- **FR-015**: A liberação de chaves MUST depender de executor, código e ambiente autorizados e verificados.
- **FR-016**: O Operador MUST NOT possuir uma credencial ou caminho administrativo que permita descriptografar o conteúdo por conta própria.
- **FR-017**: O Curador MUST poder revogar diretamente uma versão publicada, sem segunda aprovação.
- **FR-018**: Uma versão revogada MUST bloquear novas execuções e gerar registro de auditoria sem conteúdo protegido.

### Retenção e descarte

- **FR-019**: Pacotes rejeitados e arquivos temporários MUST ser excluídos automaticamente após 24 horas, salvo retenção legal ou investigação ativa.
- **FR-020**: A versão aprovada e ativa MUST ser mantida até revogação.
- **FR-021**: Versões históricas aprovadas MUST ser mantidas por 90 dias para auditoria e rollback controlado.
- **FR-022**: Backups, réplicas, snapshots, memória, chaves temporárias e resíduos de execução MUST obedecer a política de retenção e descarte verificável.

## 4. Critérios de aceite e cenários

### User Story 1 — Preparação protegida

Como Curador, quero preparar o pacote na minha própria casa para que o conteúdo nunca atravesse a rede em claro.

**SC-001**

- **Given** arquivos declarativos sintéticos e um cliente local confiável;
- **When** o Curador prepara o pacote para transmissão;
- **Then** manifesto, hash, assinatura e cifragem devem ser concluídos antes do envio;
- **And** nenhum conteúdo em claro deve ser enviado ou registrado.

### User Story 2 — Rejeição em quarentena

Como responsável pela segurança, quero que pacotes inválidos sejam contidos antes de publicação ou execução.

**SC-002**

- **Given** um pacote protegido em quarentena;
- **When** a validação detectar formato proibido, assinatura inválida ou integridade incorreta;
- **Then** o pacote deve ser rejeitado;
- **And** publicação e execução devem ser bloqueadas;
- **And** o registro deve conter apenas metadados sanitizados.

### User Story 3 — Aprovação e publicação

Como Curador, quero aprovar um pacote validado antes de sua publicação.

**SC-003**

- **Given** um pacote validado automaticamente;
- **When** o Curador aprovar o pacote na sandbox sintética;
- **Then** o sistema deve publicar somente a versão aprovada;
- **And** a decisão deve ser registrada;
- **And** nenhuma publicação produtiva deve ocorrer sem aprovador independente.

### User Story 4 — Execução interna

Como auditor, quero comprovar que o processamento não deixa a fronteira do Cofre.

**SC-004**

- **Given** uma versão aprovada e um executor autorizado/verificado;
- **When** o sistema processar o pacote;
- **Then** todo o processamento deve ocorrer dentro do Cofre;
- **And** APIs, modelos e provedores externos não devem ser utilizados;
- **And** o resultado deve ser tipado e a auditoria não deve conter conteúdo protegido.

### User Story 5 — Retenção e revogação

Como Curador, quero revogar uma versão e controlar seu ciclo de vida.

**SC-005**

- **Given** uma versão ativa e versões históricas aprovadas;
- **When** o Curador revogar a versão ativa;
- **Then** novas execuções devem ser bloqueadas;
- **And** a revogação deve ser auditada;
- **And** versões históricas devem permanecer disponíveis por 90 dias;
- **And** temporários e rejeitados devem ser excluídos após 24 horas, salvo exceção formal.

## 5. Contratos e invariantes de segurança

### Pré-condições

1. O Gate 0 permanece aberto e nenhum dado real é permitido.
2. O cliente local está autenticado, assinado, verificável e restrito a destinos aprovados.
3. O pacote contém somente formatos declarativos permitidos.

### Pós-condições

1. Nenhuma transmissão ocorre sem assinatura e cifragem prévias.
2. Nenhum pacote rejeitado pode ser publicado ou executado.
3. Toda publicação e revogação possui registro auditável sem conteúdo protegido.
4. A política de retenção e descarte produz evidência verificável.

### Invariantes

- **Plaintext Zero fora da custódia:** conteúdo protegido não pode aparecer em UI, logs, erros, dumps ou auditoria.
- **Fronteira interna:** o processamento não pode depender de serviço externo.
- **Separação de poderes:** administrar infraestrutura não concede capacidade autônoma de descriptografar.
- **Imutabilidade:** uma versão publicada não pode ser alterada; alterações geram nova versão.
- **Não promoção automática:** sandbox e produção permanecem caminhos distintos.

## 6. Rastreabilidade das fontes

- **PRD:** fronteira do Cofre, FD-Core, API estreita, executor, KMS/HSM, Gate 0 e decisões operacionais pendentes.
- **Livro SDD:** especificar antes de planejar e implementar; clarificar; gerar checklist e tarefas; analisar; implementar com testes e validação.
- **Parecer do cliente:** cliente local confiável, proteção pré-transmissão, Operador sem descriptografia, executor atestado, formatos declarativos, scanners internos e descarte verificável.
- **Decisões do Curador:** CLARIFY-001 a CLARIFY-007 registradas em `planejamento/PROPOSTA-FLUXO-CURADOR-UPLOAD-EXECUCAO.md`.

## 7. Aprovação e limites

**Decisão:** especificação aprovada pelo Curador/responsável pelo produto.

**Data da aprovação:** 2026-09-10.

**Limite da decisão:** esta aprovação autoriza o planejamento SDD da feature. Não autoriza uso de dados reais, produção, escolha irreversível de provedor ou fechamento do Gate 0.

## 8. Gate desta especificação

Esta especificação foi aprovada no Specify Gate. O próximo artefato obrigatório é o `plan.md`, seguido de checklist, tarefas e análise antes de qualquer código.
