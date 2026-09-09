# Feature Specification: Casca Visual da Sandbox (P1)

**Feature Branch**: `002-ui-sandbox-shell`
**Created**: 2026-09-09
**Status**: Concluída — revisão humana aprovada
**Priority**: P1

## 1. Problema e intenção

O thin slice possui domínio, API estreita e store de apresentação, mas não possui uma entrada visual executável. Precisamos de uma casca Vite/React mínima para demonstrar o fluxo da sandbox com dados sintéticos e permitir validação local do comportamento seguro.

## 2. Escopo

### Dentro do escopo

- `index.html` como ponto de entrada do Vite.
- `main.tsx` para montar a aplicação React.
- Um painel visual mínimo da sandbox.
- Campos para referência opaca e assinatura de validação.
- Ação de processamento conectada ao store existente.
- Exibição de carregamento, veredito, erro tipado e logs já sanitizados.
- Uso exclusivo de fixtures sintéticas e de uma implementação em memória.

### Fora do escopo

- Autenticação, autorização ou usuários reais.
- Persistência, rede, backend ou integração com produção.
- Exibição de plaintext, payload cifrado, chaves, stack trace ou segredos.
- Design system completo, responsividade avançada ou publicação.

## 3. Critérios de aceite

### SC-001 — Aplicação montável

**Given** o projeto com dependências instaladas,
**When** o Vite processa o ponto de entrada,
**Then** `npm run build` termina com sucesso e a aplicação possui um elemento raiz para montagem React.

### SC-002 — Solicitação opaca

**Given** a casca visual carregada,
**When** o operador informa uma referência opaca e uma assinatura sintética,
**Then** a tela oferece uma ação de processamento e não apresenta campos ou valores de plaintext, chaves ou payload.

### SC-003 — Resultado estreito

**Given** uma solicitação processada pela sandbox,
**When** o caso de uso retorna sucesso ou falha tipada,
**Then** a tela exibe somente estado de carregamento, veredito ou mensagem de erro segura e logs sanitizados.

## 4. Invariantes de segurança

- A UI não recebe nem renderiza plaintext.
- A UI não chama rede nem persiste credenciais.
- A resposta visual não expõe stack trace, payload, chave ou metadado protegido.
- Os dados usados pela aplicação são sintéticos e descartáveis.

## 5. Evidência esperada

- Testes de aceitação executados primeiro em estado Red por ausência dos artefatos de entrada.
- Implementação mínima fazendo os testes passarem em Green.
- `npm test`, `npx tsc --noEmit` e `npm run build` aprovados.
- Revisão humana dos arquivos gerados e confirmação de que não há dados reais.
