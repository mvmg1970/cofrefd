import type { AtivoLogicoProtegido } from "../domain/entities/ativo";
import type { AtivoRepository } from "../domain/repositories/ativo-repository";

/**
 * Repositório em memória para persistência de ativos sintéticos na sandbox do cofre.
 * 
 * Em total conformidade com as restrições do Gate 0 (PRD § 1 e § 7), este componente
 * mantém a custódia dos dados exclusivamente em memória volátil, simulando de forma
 * segura e agnóstica o comportamento de armazenamento de ativos protegidos sem qualquer
 * dependência de banco de dados físicos ou provedores de nuvem.
 */
export class InMemoryAtivoRepository implements AtivoRepository {
  private readonly ativos = new Map<string, AtivoLogicoProtegido>();

  async buscarPorReferencia(referenciaOpaca: string): Promise<AtivoLogicoProtegido | null> {
    return this.ativos.get(referenciaOpaca) || null;
  }

  async salvarSintetico(ativo: AtivoLogicoProtegido): Promise<void> {
    this.ativos.set(ativo.chaveReferencia, ativo);
  }
}
