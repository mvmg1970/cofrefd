# Parecer de Revisão Independente de Segurança — SPEC 004

**Feature avaliada:** `004-ingestao-protegida-curador`
**Pacote analisado:** `PACOTE-REVISOR-INDEPENDENTE-004.zip`
**SHA-256 do ZIP:** `52775cee6a0143bcc18b5a0192083de29ec3c3b195c1813285f9aae68021480a`
**Commit base declarado:** `ef1efa4ca855b7ba0dffb2f26fe443cc2c788ca7`
**Data:** 13/09/2026
**Revisor:** Manus AI — Revisor Sênior Independente de Segurança Ofensiva e Arquitetura de Sistemas

## Decisão executiva

**Rejeitado para fechamento do Gate 0, produção, piloto com dados reais ou declaração de segurança operacional.** O Gate 0 permanece aberto.

O thin slice sintético é coerente com os requisitos documentais e reproduziu 31 arquivos de teste, 75 testes aprovados, type-check aprovado e build aprovado. Essas evidências não comprovam segurança produtiva.

## Controles comprovados com ressalva

- manifesto, hash e formatos declarativos;
- AES-256-GCM e Ed25519 no processo local sintético;
- regras de quarentena, aprovação, revogação e auditoria sanitizada;
- ausência de plaintext nos cenários locais testados;
- auditoria npm sem vulnerabilidades conhecidas no ambiente da revisão.

## Bloqueadores e achados

- **C-001:** não há KMS/HSM, IAM produtivo ou custódia que impeça acesso administrativo ao material de descriptografia;
- **C-002:** o executor é apenas um objeto de configuração em memória, sem isolamento operacional real;
- **A-001:** gateway, validação, credencial, anti-replay e quarentena não formam pipeline persistente e integrado;
- **A-002:** anti-replay depende de estado fornecido pelo chamador e não é durável ou atômico;
- **A-003:** não há prova de egress deny-by-default em runtime;
- **M-001:** retenção/descarte são decisões puras, sem remoção operacional verificável;
- **M-002:** a sanitização não cobre comprovadamente todos os sinks de logs, tracing, métricas, dumps e telemetria;
- **B-001:** o ZIP não contém `.git`, e relatórios históricos precisam ser reconciliados.

## Correções exigidas antes de nova revisão

1. Implementar custódia real com KMS/HSM, IAM separado, attestation verificável e autorização de uso único.
2. Implementar executor efêmero isolado, com imagem imutável, filesystem mínimo, limites e rede deny-by-default.
3. Implementar ingestão persistente e integrada, com transições atômicas, quarentena durável e testes de reinício/concorrência/falhas parciais.
4. Implementar lifecycle verificável para storage, backups, réplicas, snapshots, memória, chaves e resíduos.
5. Centralizar auditoria sanitizada e testar todos os canais operacionais.
6. Atualizar matriz de rastreabilidade para distinguir código, ambiente controlado e ambiente produtivo equivalente.
7. Reconciliar o `validation-report.md` histórico e registrar a identificação exata do snapshot.

## Registro de independência

O revisor declarou não ter implementado a maior parte da feature, não ter aprovado o próprio código, não responder à equipe de desenvolvimento e não receber remuneração condicionada à aprovação. O parecer foi baseado no snapshot recebido, sem acesso a produção, dados reais, KMS/HSM, infraestrutura ou credenciais operacionais.

**Registro:** `review-004-2026-09-13-sha256-52775cee6a0143bcc18b5a0192083de29ec3c3b195c1813285f9aae68021480a`
