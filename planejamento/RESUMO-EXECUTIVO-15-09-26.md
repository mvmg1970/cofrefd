# Resumo Executivo — 15Set26

## O que fizemos

Hoje iniciamos o laboratório técnico do Cofre Flexdomini na AWS, seguindo o PRD, a Constituição de SDD, o parecer independente e as decisões do Curador.

A conta AWS foi protegida com MFA no usuário root, orçamento mensal de US$ 30,00 e acesso administrativo separado pelo IAM Identity Center. O acesso diário passou a ser realizado pelo usuário `cofre-lab-admin`, sem uso operacional do root.

Foi criada uma instância EC2 `m5.xlarge`, com Amazon Linux 2023, na região `us-east-1`. A configuração incluiu volume EBS de 30 GiB criptografado com `aws/ebs`, IMDSv2 obrigatório e grupo de segurança permitindo SSH somente a partir do IP do administrador. As verificações de saúde da instância foram aprovadas.

O suporte a AWS Nitro Enclaves foi habilitado. Instalamos o Nitro CLI e as ferramentas de desenvolvimento, configuramos o allocator e confirmamos os grupos de acesso necessários. Em seguida, construímos a imagem oficial sintética Hello Enclave, geramos a imagem `.eif`, executamos um enclave em modo de demonstração e observamos a mensagem produzida dentro do enclave.

Também registramos as medições PCR da imagem, encerramos o enclave corretamente e interrompemos a instância para evitar novas cobranças de computação.

## O que isso comprova

- o laboratório AWS foi criado na região aprovada;
- o acesso administrativo não-root está funcionando;
- o armazenamento da instância está criptografado;
- o acesso SSH está restrito ao administrador;
- o IMDSv2 está obrigatório;
- o runtime Nitro Enclaves está instalado;
- o allocator está ativo;
- um enclave sintético foi criado, executado e encerrado com sucesso;
- as medições PCR foram geradas;
- não foram utilizados dados reais ou segredos reais.

## O que ainda não está comprovado

O teste realizado foi uma validação inicial de infraestrutura e execução sintética. Ele ainda não comprova:

- atestação vinculada ao AWS KMS;
- liberação de chaves condicionada às medições do enclave;
- firewall deny-by-default e ausência de egress indevido;
- cliente local confiável para cifragem e assinatura antes da transmissão;
- ingestão de pacote protegido do Cofre;
- processamento do fluxo real dentro do enclave;
- retenção, descarte e limpeza verificáveis;
- separação operacional completa entre Curador, Operador e Administrador;
- segurança produtiva ou autorização para dados reais.

## Próxima sequência de trabalho

1. Retomar a instância somente durante o próximo ciclo de testes.
2. Registrar e validar o firewall do host e a política de egress.
3. Criar a identidade de serviço e a role mínima para o laboratório.
4. Configurar o AWS KMS sem exportação de chaves privadas.
5. Vincular a autorização criptográfica à atestação e às medições aprovadas.
6. Construir uma imagem sintética do Cofre sem modo debug.
7. Testar comunicação controlada por vsock, sem rede externa no enclave.
8. Integrar o pacote protegido sintético e validar o caminho de execução.
9. Registrar testes de acesso administrativo, exfiltração, descarte e auditoria.
10. Atualizar a T003 com todas as evidências e somente então submetê-la à revisão.

## Situação executiva

O projeto avançou da preparação documental para a validação física de uma plataforma AWS compatível com Nitro Enclaves. Temos agora um laboratório funcional para testes sintéticos, mas ainda não temos um Cofre produtivo.

O Gate 0 permanece sujeito aos controles e aprovações já definidos. O próximo ciclo continuará sem dados reais e sem autorização de produção até que as evidências de isolamento, atestação, KMS, rede, descarte e revisão de segurança sejam concluídas.
