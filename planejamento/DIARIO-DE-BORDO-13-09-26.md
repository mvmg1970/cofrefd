# DIÁRIO DE BORDO em 13Set26

Hoje iniciamos a preparação do laboratório AWS para o hardening operacional do Cofre Flexdomini, mantendo o fluxo de trabalho alinhado ao PRD, ao livro de boas práticas de SDD, ao parecer independente e às decisões do Curador.

Foram realizadas as seguintes atividades:

- Avaliação do notebook local como possível ambiente de testes.
- Confirmação de que o notebook possui TPM habilitado, mas não apresentou virtualização disponível no firmware.
- Decisão de utilizar a AWS como plataforma do laboratório controlado.
- Escolha de AWS EC2 com Nitro Enclaves e AWS KMS como arquitetura do laboratório.
- Registro da decisão técnica nos artefatos da SPEC 005.
- Definição da instância inicial `m5.xlarge` com Amazon Linux 2023.
- Criação de orçamento mensal de US$ 30,00 na AWS.
- Configuração de dois dispositivos MFA para o usuário root.
- Habilitação do IAM Identity Center.
- Criação do usuário administrativo `cofre-lab-admin`.
- Configuração de MFA para o usuário administrativo.
- Criação do conjunto de permissões temporário `CofreLabProvisioning`.
- Associação do usuário administrativo à conta AWS.
- Validação de login não-root no AWS Access Portal.
- Correção da região de Ohio para Leste dos EUA (Norte da Virgínia), conforme a decisão registrada.
- Criação da instância EC2 `cofre-lab-parent-001`.
- Configuração e evidência de suporte a Nitro Enclaves.
- Configuração de volume raiz de 30 GiB, tipo `gp3`, criptografado com `aws/ebs`.
- Configuração para excluir o volume no encerramento da instância.
- Restrição de SSH ao endereço IP do administrador, sem exposição para `0.0.0.0/0`.
- Desabilitação das entradas HTTP e HTTPS públicas.
- Configuração de IMDSv2 como obrigatório.
- Criação e armazenamento local do par de chaves ED25519 para acesso SSH.
- Confirmação de que a instância passou nas verificações de sistema, instância e EBS.
- Orientação para interromper a instância durante a pausa, evitando cobrança de computação.

## Resultado das validações realizadas

- Orçamento AWS criado com limite mensal de US$ 30,00.
- MFA do root configurado com dois dispositivos.
- Login não-root validado pelo AWS Access Portal.
- Instância EC2 criada na região aprovada.
- Tipo de instância validado: `m5.xlarge`.
- AMI validada: Amazon Linux 2023.
- Suporte a Nitro Enclaves confirmado como habilitado.
- Volume EBS confirmado como criptografado.
- IMDSv2 confirmado como obrigatório.
- Regras de rede confirmadas sem SSH aberto para a internet.
- Verificações de status da instância aprovadas.

Essas evidências comprovam a preparação inicial do laboratório AWS. Elas ainda não comprovam a instalação do Nitro CLI, a execução de um enclave, a atestação criptográfica, a política KMS vinculada às medições, a ausência de egress no enclave ou a equivalência com produção.

## Percentual realizado

Considerando a preparação administrativa e a criação controlada da infraestrutura inicial AWS:

aproximadamente 35% da T003 concluído.

Considerando a implementação completa do hardening operacional previsto na SPEC 005:

o trabalho ainda está em fase inicial. Permanecem pendentes a instalação e configuração do Nitro CLI, a criação da imagem do enclave, a atestação, a integração com KMS, os testes de isolamento, egress, acesso administrativo, descarte, auditoria e a revisão independente final.

## Situação atual

O laboratório AWS foi criado com controles iniciais de custo, identidade, rede, armazenamento e suporte a Nitro Enclaves. O enclave sintético foi encerrado e a instância EC2 foi confirmada como interrompida, evitando novas cobranças de computação.

O projeto continua restrito a dados sintéticos. Não há autorização para dados reais, produção ou fechamento do Gate 0. O próximo passo obrigatório é retomar a instância, validar firewall e política de egress e então avançar para a atestação e integração controlada com KMS.
