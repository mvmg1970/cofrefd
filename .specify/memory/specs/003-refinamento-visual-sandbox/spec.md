# Feature Specification: Refinamento Visual da Sandbox (P1)

**Feature Branch**: `003-refinamento-visual-sandbox`
**Created**: 2026-09-09
**Status**: Concluída — revisão humana aprovada
**Priority**: P1

## 1. Problema e intenção

A casca visual atual comprova o fluxo técnico, mas ainda apresenta a interface com estilos nativos do navegador. Para uma demonstração ao cliente, precisamos comunicar a identidade Flexdomini/Cofre com uma composição institucional, escura e elegante, sem alterar o comportamento da sandbox.

## 2. Direção visual

- Fundo principal verde-petróleo muito escuro.
- Tipografia serifada de destaque no título e tipografia simples para controles.
- Paleta de texto marfim e acentos dourados/âmbar.
- Cabeçalho com marca textual “FLEXDOMINI” e navegação demonstrativa.
- Hero em duas colunas: mensagem institucional à esquerda e diagrama abstrato do cofre à direita.
- Cartões e controles com bordas discretas, baixo ruído visual e contraste acessível.
- Responsividade básica para telas menores.

## 3. Escopo

### Dentro do escopo

- Criar estilos locais para a primeira tela da sandbox.
- Reorganizar visualmente o cabeçalho, hero, formulário, resultado e logs.
- Preservar os campos, o processamento, o veredito, os erros seguros e os logs sanitizados.
- Usar apenas CSS e elementos nativos; nenhum serviço externo, fonte remota ou imagem remota.
- Usar marca textual/forma abstrata local, sem alegar ser o logotipo oficial.

### Fora do escopo

- Redesign completo do produto.
- Navegação para páginas reais.
- Autenticação, backend, persistência ou dados reais.
- Compra/licenciamento de fontes ou reprodução literal de ativos da referência.

## 4. Critérios de aceite

### SC-001 — Identidade visual

**Given** a tela da sandbox carregada,
**When** o cliente a visualiza,
**Then** ela apresenta fundo verde-petróleo, texto marfim, acentos dourados e hierarquia visual institucional.

### SC-002 — Hero demonstrativo

**Given** a primeira tela,
**When** o cliente a visualiza em uma janela ampla,
**Then** há cabeçalho, mensagem principal e um elemento visual abstrato relacionado ao cofre, sem depender de rede ou imagem externa.

### SC-003 — Fluxo preservado

**Given** os mesmos valores sintéticos da sandbox,
**When** o operador envia o formulário,
**Then** o veredito ou erro seguro continua sendo exibido e os logs continuam sem plaintext, chaves ou payload.

### SC-004 — Responsividade básica

**Given** uma janela estreita,
**When** a tela é exibida,
**Then** o conteúdo se reorganiza em uma coluna sem overflow horizontal nem perda dos controles principais.

## 5. Invariantes

- Nenhum segredo, plaintext, payload ou stack trace pode ser adicionado ao DOM.
- O processamento continua usando somente fixtures sintéticas.
- A referência visual é inspiração de direção, não uma dependência remota.
