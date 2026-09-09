import type { AtivoLogicoProtegido } from "../entities/ativo";

export interface AtivoRepository {
  /**
   * Busca um ativo protegido estritamente por sua referência lógica opaca.
   * Retorna o ativo ou null se não for encontrado na sandbox.
   */
  buscarPorReferencia(referenciaOpaca: string): Promise<AtivoLogicoProtegido | null>;

  /**
   * Salva uma nova fixture sintética de teste na sandbox do cofre.
   */
  salvarSintetico(ativo: AtivoLogicoProtegido): Promise<void>;
}
