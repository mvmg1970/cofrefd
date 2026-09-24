# Diário de Bordo — 22Set26

## Objetivo do dia

Recuperar e versionar as evidências do laboratório T003, consolidar a T004 com mTLS de laboratório e executar o teste controlado de NitroTPM/measured boot.

## Atividades realizadas

- Instância do laboratório AWS retomada exclusivamente para recuperação de evidências.
- Diretório `/home/ssm-user/evidence/T003` localizado na EC2.
- Todos os arquivos do manifesto `SHA256SUMS.txt` validados na EC2 com resultado `OK`.
- Pacote `T003-evidence-2026-09-19.tar.gz` transferido para a máquina local.
- SHA-256 do pacote confirmado: `9a1521d7b0657d0215b144fc73c88c47d23d205b36b3d134ce92b85bc8f3acf0`.
- 37 artefatos T003 extraídos e versionados no commit `caeed74`.
- Branch remota criada: `feat/t004-mtls-laboratorio`.
- Política sintética de identidade, rotação, revogação e matriz de confiança implementada.
- Certificados de laboratório gerados fora do repositório, em diretório temporário.
- CA, certificado de servidor e certificado de cliente validados com OpenSSL 3.5.7.
- Handshake mTLS real executado; cliente sem certificado e certificado revogado foram rejeitados.
- Suíte final: 34 arquivos e 90 testes aprovados; build aprovado.
- T004 registrada como concluída em laboratório, com ressalva explícita de não equivalência produtiva.
- Commits T004 publicados na branch remota até `8c2a8cf`.

## Teste NitroTPM executado

- Confirmado que `m5.xlarge` suporta NitroTPM 2.0 e UEFI.
- Criado snapshot criptografado de 30 GiB: `snap-04572f2ba72800623`.
- Registrada AMI de laboratório com `BootMode=uefi` e `TpmSupport=v2.0`: `ami-083aa23f3fb2ac60a`.
- Criada a instância temporária `i-0f0ba023ac3b575ba` com Nitro Enclaves habilitado.
- Confirmados `/dev/tpm0`, `/dev/tpmrm0`, tabela ACPI `AMZNTPM2` e `TPMEventLog`.
- Instalados `aws-nitro-tpm-tools`, `systemd-boot-unsigned` e `tpm2-tools`.
- Gerado atestado NitroTPM CBOR de 4.900 bytes; hash inicial: `a1aefbe65e4a8c7a4d7c401f22bf3df3b80864cef6632a68305b3bb60199d281`.
- Gerado UKI em laboratório com seções `.osrel`, `.cmdline`, `.linux` e `.initrd`; tamanho 37.606.111 bytes; hash: `f2a8e427040eefff6d35518d5a2cb0d0f3836f97b9bc0b927918357cf9c0e203`.
- PCRs esperados calculados pelo UKI: PCR4 `8f2789...db14fe7`, PCR7 `98441c...7af35`, PCR12 zerado.
- PCRs reais no boot GRUB: PCR4 `40811F...6401D`, PCR7 coincidente, PCR12 zerado.
- Tentativa de boot único pelo GRUB/custom.cfg deixou a instância temporariamente sem reachability; a instância foi recuperada por stop/start e voltou saudável.
- O boot real voltou ao kernel separado `/boot/vmlinuz-6.18.44-99.149.amzn2023.x86_64`; portanto o PCR4 do UKI não foi comprovado no boot real.
- Entrada experimental e UKI foram desativados sem apagar os artefatos; evidência final foi empacotada, transferida, validada por SHA-256 e publicada no commit `888532f`.
- Instância de teste foi parada após a coleta.

## Estado atual

O fluxo mTLS possui evidência sintética reproduzível. O NitroTPM está presente e emite atestação, mas a T003 permanece aberta porque o measured boot do UKI não foi comprovado no boot real: PCR4 divergiu do valor esperado. Também faltam evidências operacionais de descarte, auditoria e equivalência produtiva.

## Próximo ciclo

Definir uma estratégia suportada para gerar uma AMI Linux attestable com UKI como artefato de boot primário, sem depender de um chainload experimental pelo GRUB. Repetir o teste somente quando houver procedimento de recuperação por console e evidência de que o kernel inicializado é o UKI calculado.

## Limites e governança

- Nenhum dado real foi utilizado.
- Nenhuma credencial produtiva foi usada.
- O laboratório não é ambiente de produção.
- O Gate 0 continua aberto.
- Qualquer novo gasto AWS deve ser limitado a uma instância/AMI de laboratório, com desligamento após a coleta.

## Ponto de parada — retomada amanhã

- Último commit publicado na branch `feat/t004-mtls-laboratorio`: `777b4ce`.
- Repositório local estava limpo após o push.
- Instância NitroTPM de teste `i-0f0ba023ac3b575ba` foi parada; não inicializar a instância antiga `cofre-lab-parent-001`.
- A instância de teste comprovou NitroTPM 2.0, atestação CBOR e leitura de PCRs.
- O UKI foi gerado, mas o boot real pelo `custom.cfg` experimental não completou; a instância foi recuperada e voltou ao kernel GRUB original.
- PCR7 e PCR12 coincidiram; PCR4 divergiu do valor esperado do UKI.
- A entrada experimental e o UKI foram desativados, preservando os artefatos com sufixo `.failed-t003`.
- Evidências finais foram commitadas no `888532f`; documentação atualizada no `0dfc637`; prompt completo publicado no `777b4ce`.
- Próximo passo: definir uma estratégia suportada para uma AMI/UKI attestable com caminho de boot verificável e recuperação por console, antes de repetir qualquer reboot.
- Não marcar T003 como concluída até PCR4 do boot real coincidir com a referência do UKI e os gates operacionais restantes terem evidência.
