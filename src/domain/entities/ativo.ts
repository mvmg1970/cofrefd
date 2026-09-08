/**
 * Entidade de domínio representando o Ativo Lógico Protegido.
 * 
 * Em total conformidade com o princípio de agnosticismo tecnológico e segurança da informação,
 * o Ativo Protegido armazena apenas propriedades lógicas puras. Ele encapsula o segredo cifrado
 * e suas políticas de validação sem expor interfaces que permitam ao FD-Core ou agentes externos
 * acessarem o plaintext original de forma desprotegida.
 */
export type AtivoLogicoProtegido = {
  /** UUID sintético descartável gerado para controle de sandbox */
  readonly id: string;
  
  /** Identificador opaco de referência externa (usado pela Narrow API) */
  readonly chaveReferencia: string;
  
  /** Hash SHA-256 da política autorizada que governa o ativo */
  readonly hashPolitica: string;
  
  /** Payload cifrado (fixture sintética contendo o segredo protegido) */
  readonly payloadCifrado: string;
  
  /** Data de criação em formato ISO 8601 para auditoria e controle temporal */
  readonly createdAt: string;
};
