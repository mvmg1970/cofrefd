# Manual da Tela — Fluxo Sintético do Cofre Flexdomini

**Versão:** 1.0
**Status:** manual do protótipo de sandbox
**Público:** cliente, responsável pelo produto e auditoria técnica

**Atualização de segurança:** esta tela continua sendo apenas uma sandbox local. Ela não é o cliente confiável de envio do Curador e não deve receber arquivos reais ou pacotes confidenciais.

## 1. Para que serve esta tela?

Esta tela é um painel demonstrativo do Cofre Flexdomini. Ela permite executar, em ambiente local e com dados sintéticos, o fluxo mínimo de solicitação e validação de um ativo protegido.

Seu objetivo é tornar visíveis três propriedades do protótipo:

1. a solicitação usa uma referência opaca, e não o conteúdo protegido;
2. a validação devolve um resultado tipado e limitado;
3. a tela e os logs não exibem plaintext, chaves, payload ou stack trace.

A tela é experimental. Ela não é uma interface de produção e não deve receber informações reais de clientes.

## 2. Como abrir

Com o projeto instalado, execute o servidor Vite no terminal:

```powershell
npm run dev -- --host 127.0.0.1
```

Abra a URL informada pelo Vite, normalmente:

```text
http://localhost:5173/
```

## 3. Estrutura visual

### Cabeçalho

Apresenta a marca textual FLEXDOMINI e links demonstrativos de navegação. Esses links são elementos visuais; não representam páginas ou integrações reais neste protótipo.

### Hero

Apresenta a mensagem institucional e um diagrama abstrato da arquitetura. O diagrama é feito localmente com CSS e não carrega imagens ou fontes externas.

### Cartão “Processe um ativo protegido”

É a área operacional da demonstração. Nela o operador informa os dados sintéticos e aciona o processamento.

### Resultado

Mostra o estado atual da solicitação: aguardando, autorizado ou erro seguro.

### Logs sanitizados

Mostra eventos operacionais mínimos da sandbox, como a referência opaca usada e o veredito obtido.

## 4. Campos da solicitação

### Referência opaca

É um identificador lógico usado para localizar um ativo na sandbox. Ele não deve conter plaintext, senha, chave, documento ou informação interpretável sobre o conteúdo protegido.

Valor sintético disponível no protótipo:

```text
ref-sintetica-001
```

### Assinatura de validação

É o valor sintético usado pelo protótipo para distinguir uma solicitação válida de uma solicitação corrompida.

Valor sintético válido:

```text
ASSINATURA_VALIDA_sintetica
```

Importante: essa verificação é uma regra de demonstração. Ela não é uma assinatura criptográfica de produção.

## 5. Ação “Processar ativo”

Ao clicar no botão, a aplicação executa esta sequência:

1. impede o envio tradicional do formulário;
2. envia a referência opaca e a assinatura ao caso de uso;
3. procura a fixture sintética no repositório em memória;
4. verifica a regra de assinatura sintética;
5. retorna sucesso ou falha tipada;
6. atualiza o painel de resultado;
7. acrescenta um evento aos logs sanitizados.

Durante esse fluxo, o payload sintético custodiado pelo repositório não é renderizado na UI.

## 6. Cenário de sucesso

Preencha:

```text
Referência opaca: ref-sintetica-001
Assinatura:      ASSINATURA_VALIDA_sintetica
```

Clique em **Processar ativo**.

Resultado esperado:

```text
Veredito: autorizado
```

Logs esperados, em essência:

```text
Solicitando processamento de ativo com referência: ref-sintetica-001...
Processamento autorizado com sucesso. Veredito: autorizado
```

## 7. Cenários de erro

### Assinatura inválida

Use a referência válida e altere a assinatura para:

```text
ASSINATURA_CORROMPIDA
```

Resultado esperado: uma mensagem segura informando falha de assinatura, sem stack trace ou conteúdo protegido.

### Ativo não encontrado

Use uma referência inexistente, por exemplo:

```text
ref-inexistente
```

Resultado esperado: uma mensagem segura informando que o ativo lógico protegido não foi encontrado na sandbox.

## 8. O que a tela não faz

Esta tela não:

- recebe dados reais;
- descriptografa conteúdo real;
- chama uma API HTTP externa;
- persiste dados em banco;
- autentica usuários;
- implementa IAM ou multi-tenancy;
- usa KMS/HSM;
- prova isolamento físico de processo/container;
- prova limpeza forense de memória;
- representa autorização para produção.

O fluxo futuro de envio deverá cifrar e assinar o pacote no ambiente do Curador antes da transmissão; essa capacidade ainda não existe nesta tela.

## 9. Checklist de demonstração

- [ ] servidor Vite iniciado localmente;
- [ ] tela carregada em `localhost`;
- [ ] título e identidade visual exibidos;
- [ ] solicitação válida retorna `autorizado`;
- [ ] assinatura inválida retorna erro seguro;
- [ ] referência desconhecida retorna erro seguro;
- [ ] logs mostram apenas referência opaca e resultado;
- [ ] nenhum plaintext, chave, payload ou stack trace aparece;
- [ ] layout continua utilizável em janela estreita;
- [ ] nenhum dado real foi inserido.

## 10. Classificação e limites

Este manual descreve o thin slice visual e sintético aprovado para demonstração. As garantias de produção ainda dependem do fechamento do Gate 0, da implementação de fronteiras reais entre custódia e executor, de autenticação, criptografia, auditoria, operação e revisão independente.

Em 13/09/2026, a revisão independente foi concluída e rejeitou o fechamento do Gate 0. O parecer confirmou que esta tela continua sendo apenas uma demonstração sintética e não comprova KMS/HSM, IAM, isolamento operacional, bloqueio de egress, descarte verificável ou autorização para dados reais.
