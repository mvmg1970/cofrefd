# Prompt para diagrama — investimento incremental em NitroTPM

Crie um diagrama executivo, didático e visualmente limpo para um investidor não técnico, explicando por que o Cofre Flexdomini precisa de um pequeno investimento incremental em infraestrutura AWS para testar TPM/measured boot.

Formato: infográfico horizontal 16:9, estilo tecnológico corporativo, fundo claro, poucos textos, ícones simples e setas evidentes. Use português do Brasil correto. Não mostrar código, comandos, credenciais, chaves privadas ou dados reais.

Título principal:

“Por que precisamos de um teste incremental de TPM/measured boot?”

Organize o diagrama em três blocos conectados:

1. “O que já foi comprovado”

- laboratório sintético;
- evidências com hashes;
- enclave isolado;
- atestação criptográfica;
- KMS de laboratório;
- mTLS entre serviços;
- selo visual verde: “controle demonstrado em laboratório”.

2. “O que ainda falta provar”

- cadeia de inicialização do host;
- TPM/NitroTPM e boot UEFI;
- PCRs de measured boot;
- bloqueio de liberação de chave quando a medição divergir;
- descarte e auditoria operacional;
- selo visual amarelo: “bloqueador de segurança, não falha do produto”.

3. “Por que há gasto incremental”

- preparar uma AMI Linux compatível;
- usar uma instância AWS temporária compatível com NitroTPM;
- coletar PCRs, atestação e hashes;
- desligar a instância após o teste;
- registrar a evidência no repositório;
- selo visual azul: “custo controlado para reduzir risco técnico”.

Inclua um fluxo inferior simples:

“software autorizado” → “boot medido” → “PCRs verificados” → “chave liberada somente se tudo coincidir” → “maior confiança para o próximo gate”.

Inclua uma caixa de decisão final:

“O investimento não é para produção. É para comprovar, com evidência criptográfica, que o ambiente que inicia o Cofre é o ambiente autorizado.”

Inclua uma nota pequena no rodapé:

“Dados sintéticos • laboratório temporário • Gate 0 ainda aberto • nenhum dado real autorizado”.

Estética: profissional, sóbria, confiável, adequada a uma apresentação para investidor. Use azul para controles comprovados, amarelo para lacunas e verde para critérios satisfeitos. Evite aparência alarmista; transmita que o gasto é incremental, limitado e associado a uma decisão objetiva de segurança.
