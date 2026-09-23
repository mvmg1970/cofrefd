# Prompt para diagrama — investimento incremental em NitroTPM

Crie um diagrama executivo, didático e visualmente limpo para um investidor não técnico, explicando o que foi executado hoje no laboratório COFREDF e por que ainda é necessário um pequeno investimento incremental em infraestrutura AWS para concluir o teste de TPM/measured boot.

Formato: infográfico horizontal 16:9, estilo tecnológico corporativo, fundo claro, poucos textos, ícones simples e setas evidentes. Use português do Brasil correto. Não mostrar código, comandos, credenciais, chaves privadas ou dados reais.

Título principal:

“Por que precisamos de um teste incremental de TPM/measured boot?”

Organize o diagrama em três blocos conectados:

1. “O que já foi comprovado hoje”

- laboratório sintético;
- evidências com hashes;
- enclave isolado;
- NitroTPM 2.0 presente em instância AWS compatível;
- dispositivo TPM 2.0 e event log reconhecidos pelo Linux;
- atestação criptográfica CBOR de 4.900 bytes;
- PCRs reais coletados e comparados;
- UKI gerado com `.linux`, `.initrd`, `.cmdline` e `.osrel`;
- evidência versionada com hashes no Git;
- KMS de laboratório;
- mTLS entre serviços;
- selo visual verde: “controle demonstrado em laboratório”.

2. “O que ainda falta provar”

- cadeia de inicialização do host;
- TPM/NitroTPM e boot UEFI;
- PCR4 do boot real coincidente com o PCR4 calculado do UKI;
- inicialização efetiva do artefato autorizado, não apenas geração do artefato;
- bloqueio de liberação de chave quando a medição divergir;
- descarte e auditoria operacional;
- destaque visual: “bloqueador de segurança; não é falha funcional do produto”.

3. “Por que há gasto incremental agora”

- construir uma AMI/UKI attestable com caminho de boot suportado;
- usar uma instância AWS temporária compatível com NitroTPM;
- repetir o boot com recuperação por console e coletar PCRs, atestação e hashes;
- desligar a instância após o teste;
- registrar a evidência no repositório;
- selo visual azul: “custo controlado para reduzir risco técnico”.

Inclua uma comparação visual central:

“UKI calculado: PCR4 esperado” ≠ “kernel que iniciou: PCR4 real”

Mostre que PCR7 e PCR12 coincidiram, mas PCR4 divergiu. Use amarelo para a divergência, sem sugerir falha do TPM.

Inclua um fluxo inferior simples:

“software autorizado” → “boot medido” → “PCRs verificados” → “chave liberada somente se tudo coincidir” → “maior confiança para o próximo gate”.

Inclua uma caixa de decisão final:

“O investimento não é para produção. É para provar, com evidência criptográfica, que o ambiente que inicia o Cofre é o ambiente autorizado — e que uma divergência de medição impede a liberação de chaves.”

Inclua uma nota pequena no rodapé:

“Dados sintéticos • instância temporária parada após o teste • T003 ainda aberta • Gate 0 ainda aberto • nenhum dado real autorizado”.

Estética: profissional, sóbria, confiável, adequada a uma apresentação para investidor. Use azul para controles comprovados, amarelo para lacunas e verde para critérios satisfeitos. Evite aparência alarmista; transmita que o gasto é incremental, limitado e associado a uma decisão objetiva de segurança.
