# Nota SDD — Probe Sintético via vsock

**Data:** 19/09/2026
**Feature relacionada:** `005-hardening-operacional-cofre`
**Classificação:** exceção metodológica documentada; laboratório sintético; não produtivo

## Registro

O probe sintético usado no ciclo AWS de 19/09/2026 foi criado para permitir a observação de resultados dentro de um enclave executado sem `DEBUG_MODE`. A saída foi transmitida ao host por vsock e os testes de DNS, HTTP, HTTPS e IMDS foram registrados.

## Conformidades mantidas

- SPEC 005, Plan, Checklist, Tasks e Analyze já estavam aprovados antes do ciclo de laboratório;
- não foram usados dados reais, segredos reais ou produção;
- o EIF foi construído com imagem base fixada por digest;
- PCR0, PCR1, PCR2 e PCR8 foram registrados;
- os resultados foram sanitizados, preservados e validados por hashes;
- os limites do laboratório e o Gate 0 aberto permanecem explícitos.

## Desvio em relação ao SDD estrito

O probe via vsock não foi tratado como uma feature SDD independente antes da primeira implementação. Não houve uma sequência formal completa de Red → Green → Refactor, nem revisão independente específica antes do experimento operacional. Os ajustes de `app.py`, `parent_receiver.py` e do allocator ocorreram durante o ciclo controlado.

Esse desvio não autoriza produção, uso de dados reais, integração KMS ou fechamento da T003/Gate 0. Os resultados devem ser classificados como evidência experimental de laboratório.

## Ação corretiva obrigatória

Antes de promover o probe ou reutilizar seu protocolo:

1. criar uma feature SDD própria ou uma tarefa formal derivada da SPEC 005;
2. escrever testes Red para o protocolo vsock, falhas, timeout, mensagens truncadas e ausência do receptor;
3. implementar Green e executar a regressão;
4. refatorar mantendo os controles negativos;
5. atualizar a matriz de rastreabilidade e obter revisão humana;
6. submeter o componente a revisão independente antes de qualquer alegação produtiva.

## Decisão atual

O EIF assinado pode continuar sendo usado somente para o experimento sintético já planejado, desde que as evidências permaneçam classificadas como laboratório. A execução assinada não deve ser tratada como atestação KMS ou autorização produtiva.
