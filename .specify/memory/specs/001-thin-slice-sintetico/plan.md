# Plano Técnico — Thin Slice Sintético

**Feature:** `001-thin-slice-sintetico`
**Versão:** 2.0
**Status:** revisado após clarify e analyze
**Classificação:** protótipo exploratório pré-Gate 0

## 1. Objetivo técnico

Implementar e validar um contrato mínimo de processamento seguro usando somente fixtures sintéticas. O incremento demonstra referências opacas, resultados tipados e ausência de conteúdo protegido nas respostas e logs observáveis.

Este plano não afirma que o protótipo fornece isolamento físico, descriptografia real, limpeza forense de memória ou prontidão para produção.

## 2. Escopo técnico

### Dentro

- contratos de domínio para ativo protegido, repositório e `Result`;
- caso de uso de processamento sintético;
- repositório volátil em memória;
- adaptador de API estreita;
- store de apresentação sem conteúdo protegido nos logs;
- testes unitários, de integração e de exfiltração;
- evidência versionada de validação.

### Fora

- HSM/KMS real ou criptografia de produção;
- executor em processo/container fisicamente isolado;
- dados reais, credenciais reais ou persistência em disco;
- multi-tenancy, autenticação produtiva e integração com provedores;
- UI Vite e entrada `index.html` — serão outra feature, se aprovadas.

## 3. Arquitetura

1. **Domínio:** regras e contratos, sem dependência de UI ou infraestrutura.
2. **Dados:** implementação volátil do contrato de custódia.
3. **Apresentação:** API estreita e store, expondo somente referência, estado e resultado autorizado.
4. **Composição:** ainda não implementada nesta feature; qualquer composição executável deve ser especificada separadamente.

O FD-Core não recebe `payloadCifrado`, plaintext, chaves, stack traces ou metadados não autorizados. O caso de uso atual não descriptografa nem expõe o payload; seu comportamento sintético é deliberadamente limitado a localizar a fixture e validar a solicitação.

## 4. Segurança e exfiltração

O sistema não deve registrar payload, plaintext, chaves ou metadados protegidos. O teste de vazamento deliberado é um controle negativo: ele deve falhar quando encontra o segredo. Ele não deve ser contado como implementação de contenção.

Qualquer sanitizador ou interceptador que seja necessário para uma política de logging deve nascer de um teste que falhe e ser integrado explicitamente à fronteira de logging. A mera inspeção dos spies não constitui contenção.

## 5. Estratégia TDD

O histórico existente é tratado como baseline exploratório: não há evidência suficiente do Red anterior aos commits de implementação. A partir desta revisão, cada melhoria será feita em ciclos pequenos, com:

1. teste novo escrito e executado em estado vermelho;
2. implementação mínima em estado verde;
3. refatoração com a suíte completa verde;
4. registro do comando, resultado e decisão no artefato de validação.

Não será feita alegação retroativa de conformidade TDD para os commits anteriores.

## 6. Constituição e riscos

O plano atende às fronteiras, minimização de contexto, erro como valor, TDD, mudança na origem e descarte seguro da constituição ratificada. O Gate 0 permanece aberto. A classificação deste código continua experimental e não autoriza dados reais.

## 7. Critérios de saída

- checklist sem pendências críticas;
- analyze sem contradições entre spec, plan e tasks;
- testes da API estreita e de exfiltração cobrindo sucesso, falha e resposta;
- contenção, se exigida, demonstrada por teste e integração real;
- `npx tsc --noEmit` e `npm test` verdes;
- riscos de dependências registrados sem uso de `npm audit fix --force`;
- aprovação humana da revisão final.
