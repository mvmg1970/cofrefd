# Decisão Técnica — Plataforma do Laboratório

**Feature:** `005-hardening-operacional-cofre`
**Data:** 2026-09-13
**Decisor:** Curador/responsável pelo produto
**Status:** Aprovada para planejamento da T003

**Configuração inicial aprovada:** instância `m5.xlarge`, Amazon Linux 2023, Nitro Enclaves habilitado.

## Decisão

O laboratório controlado da SPEC 005 utilizará **AWS EC2 com Nitro Enclaves e AWS KMS**, exclusivamente com dados sintéticos e credenciais temporárias.

## Justificativa

Essa plataforma oferece isolamento de CPU e memória, ausência de rede externa e armazenamento persistente no enclave, além de atestação criptográfica vinculável a políticas do KMS.

## Limites

- Esta decisão não autoriza produção, dados reais ou fechamento do Gate 0.
- A criação de recursos AWS dependerá de orçamento e região aprovados.
- A AWS não será tratada como controle automaticamente comprovado; cada controle exigirá teste e evidência.
- O notebook local permanecerá como estação de desenvolvimento e administração controlada.

## Evidências esperadas

- região, conta e orçamento registrados;
- tipo de instância compatível e configuração do Nitro Enclave;
- imagem do enclave e medições registradas;
- política KMS baseada em atestação;
- testes de ausência de egress, acesso administrativo, descriptografia indevida e descarte;
- relatório distinguindo evidência sintética, laboratorial e produtiva.

## Próximo passo

Atualizar o plano e executar a T003 somente após preparar a conta AWS com controles de custo e acesso mínimo.
