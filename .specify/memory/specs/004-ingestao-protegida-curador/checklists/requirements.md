# Checklist de Requisitos — Ingestão Protegida do Curador

**Feature:** `004-ingestao-protegida-curador`
**Spec:** `../spec.md`
**Plan:** `../plan.md`
**Status:** Aprovado — Checklist Gate concluído pelo Curador
**Data:** 2026-09-10

## A. Integridade da especificação

- [ ] Todos os requisitos funcionais da SPEC 004 possuem identificador único.
- [ ] Todos os requisitos possuem cenário de aceite ou tarefa correspondente.
- [ ] Escopo e não-objetivos estão explícitos.
- [ ] Pré-condições, pós-condições e invariantes estão definidos.
- [ ] O Gate 0 permanece explicitamente aberto.
- [ ] O uso de dados reais continua proibido nesta fase.

## B. Proteção no ambiente do Curador

- [ ] O cliente local confiável é identificado como componente separado.
- [ ] O cliente local gera manifesto, versão e hash.
- [ ] O pacote é assinado antes da transmissão.
- [ ] O pacote é cifrado antes da transmissão.
- [ ] O destino da transmissão é validado e restrito.
- [ ] Credenciais de envio são temporárias e possuem proteção anti-replay.
- [ ] Conteúdo em claro não aparece em UI, logs, erros ou transporte.

## C. Quarentena e validação

- [ ] Todo pacote recebido entra primeiro em quarentena.
- [ ] Nenhum pacote em quarentena pode ser publicado ou executado.
- [ ] Validação de formato declarativo está prevista.
- [ ] Validação de integridade está prevista.
- [ ] Validação de assinatura está prevista.
- [ ] Validação de proveniência e versão está prevista.
- [ ] Componentes proibidos são rejeitados.
- [ ] Scanners operam localmente ou dentro da fronteira protegida.
- [ ] Falhas geram metadados sanitizados, sem conteúdo protegido.

## D. Aprovação e publicação

- [ ] Validação automática não publica o pacote.
- [ ] Aprovação humana explícita é obrigatória.
- [ ] Autoaprovação pelo Curador é limitada à sandbox sintética.
- [ ] Publicação produtiva exige aprovador humano independente.
- [ ] Sandbox e produção possuem caminhos separados.
- [ ] Versões publicadas são imutáveis e identificadas por hash.
- [ ] Não existe promoção automática da sandbox para produção.

## E. Execução e chaves

- [ ] Processamento ocorre integralmente dentro do Cofre.
- [ ] APIs, modelos e provedores externos estão bloqueados.
- [ ] Executor é isolado, efêmero e verificável.
- [ ] Liberação de chave depende de executor, código e ambiente autorizados.
- [ ] Alteração não aprovada invalida a autorização de execução.
- [ ] Operador não consegue descriptografar o conteúdo.
- [ ] Administrador de infraestrutura não consegue descriptografar autonomamente.
- [ ] Não existe credencial única para administrar e descriptografar.

## F. Retenção, descarte e revogação

- [ ] Pacotes rejeitados são excluídos após 24 horas.
- [ ] Arquivos temporários são excluídos após 24 horas.
- [ ] Retenção legal e investigação ativa possuem exceção formal e auditável.
- [ ] Versão ativa permanece até revogação.
- [ ] Histórico aprovado permanece por 90 dias.
- [ ] Curador pode revogar diretamente uma versão publicada.
- [ ] Revogação bloqueia novas execuções.
- [ ] Backups, réplicas e snapshots obedecem à política de retenção.
- [ ] Memória, chaves temporárias e resíduos possuem descarte verificável.

## G. Auditoria e evidências

- [ ] Aprovação, publicação e revogação são auditáveis.
- [ ] Auditoria contém ator, evento, versão, hash, decisão e timestamp mínimos.
- [ ] Auditoria não contém plaintext, chaves, payload ou caminhos sensíveis.
- [ ] Tentativas de acesso proibido geram alerta sanitizado.
- [ ] Existe evidência de bloqueio de egress.
- [ ] Existe evidência de isolamento do executor.
- [ ] Existe evidência do descarte nos prazos definidos.
- [ ] Existe revisão independente de segurança antes de produção.

## H. Rastreabilidade

- [ ] Cada item do checklist referencia requisito, cenário ou decisão da SPEC 004.
- [ ] Cada requisito possui tarefa futura rastreável.
- [ ] Cada tarefa possui evidência esperada.
- [ ] PRD, livro SDD, parecer do cliente e decisões do Curador estão representados.
- [ ] Nenhum item aprovado é tratado como implementação já realizada.

## Resultado da revisão

**Itens aprovados:** ____ / ____
**Itens pendentes:** ____
**Bloqueadores:** ____
**Revisor:** ______________________________
**Data:** ____/____/________
**Decisão:** [ ] Aprovado  [ ] Aprovado com pendências  [ ] Requer correção

## Registro do Checklist Gate

**Decisão:** checklist aprovado pelo Curador/responsável pelo produto.

**Data da aprovação:** 2026-09-10.

**Limite da decisão:** os itens continuam sendo requisitos a implementar e validar. A aprovação não comprova a existência dos controles, não autoriza produção ou dados reais e não fecha o Gate 0.
