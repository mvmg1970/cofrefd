# Pré-revisão de Segurança — Ingestão Protegida do Curador

**Feature:** `004-ingestao-protegida-curador`
**Data:** 2026-09-10
**Status:** Revisão independente concluída — bloqueadores produtivos pendentes

## 1. Escopo

Este documento registra as validações internas executadas para preparar a revisão independente da feature. Ele não é um relatório de red team e não substitui auditoria externa ou revisão por pessoa independente da implementação.

## 2. Evidências internas

- `npm test`: 31 arquivos aprovados, 75 testes aprovados.
- `npx tsc --noEmit`: concluído sem erros.
- `npm run build`: concluído com sucesso; bundle Vite gerado.
- `npm audit --omit=optional`: inconclusivo devido a falha de comunicação com o endpoint de advisories do npm.

## 3. Controles cobertos pelos testes sintéticos

- manifesto, hash e formatos declarativos;
- cifragem AES-256-GCM e assinatura Ed25519;
- credencial temporária e anti-replay em memória;
- gateway sem descriptografia e quarentena;
- retenção de 24 horas, histórico de 90 dias e exceções;
- validação de formato, assinatura, proveniência e versão;
- aprovação humana e bloqueio de promoção automática;
- executor sintético com rede desabilitada e limites;
- política de liberação de chave;
- bloqueio de Operador/Administrador;
- vínculo de código, imagem e ambiente;
- revogação e auditoria sanitizada.

## 4. Limitações e achados abertos

- Os controles ainda são sintéticos e não provam isolamento produtivo.
- Não há KMS/HSM produtivo, atestação real, IAM produtivo ou storage protegido.
- Anti-replay, retenção e auditoria ainda não possuem infraestrutura durável.
- Não há evidência real de bloqueio de egress em ambiente produtivo.
- O cliente local confiável ainda não é um produto assinado e distribuído.
- A auditoria npm precisa ser repetida em ambiente com acesso funcional ao registry.

## 5. Revisão independente obrigatória

Para encerrar T025, um revisor independente ou equipe de red team deverá avaliar:

- ameaça de acesso administrativo e abuso de chaves;
- transmissão antes da cifragem;
- isolamento e atestação do executor;
- egress, logs, memória, snapshots e backups;
- retenção, descarte e investigação;
- promoção sandbox/produção e autoridade de revogação;
- resultados dos testes e divergências entre implementação e requisitos.

## 6. Decisão

**T025:** execução concluída com parecer independente registrado em `security-review-independent-2026-09-13.md`.
**Bloqueadores:** C-001, C-002 e A-001, além dos achados altos e médios descritos no parecer independente.
**Gate 0:** permanece aberto.

O parecer independente completo está registrado em `security-review-independent-2026-09-13.md`. A revisão confirmou a natureza sintética dos controles e rejeitou o fechamento do Gate 0, produção ou uso de dados reais.

## 7. Roteiro consolidado para o revisor independente

### Solicitação

Solicita-se uma revisão independente deste arquivo e de todos os artefatos relacionados da feature:

- `spec.md`;
- `plan.md`;
- `checklists/requirements.md`;
- `tasks.md`;
- `traceability-matrix.md`;
- PRD do Cofre Flexdomini;
- parecer técnico estratégico do cliente.

O revisor deve avaliar o commit/versão efetivamente analisado e não presumir que um requisito documentado esteja implementado.

### Perguntas obrigatórias

1. O relatório representa corretamente o que está implementado?
2. Há algum controle descrito como existente sem evidência suficiente?
3. A cifragem ocorre antes da transmissão ou isso ainda é apenas um teste sintético?
4. O envelope pode expor plaintext, chaves, caminhos ou metadados sensíveis?
5. O Operador ou Administrador possui algum caminho de descriptografia?
6. A liberação de chaves está realmente vinculada ao executor, código, ambiente, pacote e solicitação única?
7. O executor está realmente isolado ou apenas modelado por contratos em memória?
8. Existe possibilidade de egress para APIs externas, modelos ou serviços públicos?
9. A quarentena impede publicação e execução indevidas?
10. A aprovação humana e a separação sandbox/produção estão efetivamente garantidas?
11. A revogação bloqueia novas execuções?
12. Retenção de 24 horas, histórico de 90 dias, backups, réplicas e snapshots estão comprovados?
13. Memória, chaves temporárias e resíduos são realmente descartados?
14. Logs e registros de auditoria podem revelar conteúdo protegido?
15. Quais ataques de exfiltração ainda não foram testados?
16. A auditoria npm deve ser repetida? Qual evidência é necessária?
17. Existem bloqueadores para avançar?
18. O Gate 0 deve permanecer aberto?

### Classificação exigida

Para cada pergunta, o revisor deve classificar o resultado como:

- Aprovado com evidência;
- Aprovado com ressalva;
- Requer correção;
- Não comprovado;
- Bloqueador.

### Entregáveis obrigatórios

O revisor deve entregar:

- conclusão executiva;
- achados classificados por severidade;
- evidência usada em cada conclusão;
- recomendações;
- decisão final: aprovado, aprovado com pendências ou rejeitado;
- nome e função do revisor;
- data da revisão;
- escopo revisado;
- commit ou versão analisada;
- declaração de independência;
- assinatura ou registro equivalente.

O parecer não deve limitar-se a aprovar este arquivo. Deve confirmar o que foi comprovado, separar controles sintéticos de controles produtivos e destacar tudo que permanece não comprovado.
