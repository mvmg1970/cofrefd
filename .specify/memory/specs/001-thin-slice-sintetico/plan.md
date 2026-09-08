# Implementation Plan: Thin Slice Sintético (P1)
**Feature Branch**: `001-thin-slice-sintetico` | **Spec**: `spec.md`
**Input**: Feature specification em `.specify/memory/specs/001-thin-slice-sintetico/spec.md`

## 1. Summary (Resumo Técnico)
Este plano técnico descreve a modelagem e a infraestrutura necessária para implementar a primeira entrega funcional do Cofre Flexdomini em ambiente estritamente de sandbox isolado [3, 8]. O objetivo principal é demonstrar, de forma prática e verificável, que as fronteiras arquiteturais projetadas são capazes de conter vazamentos de informações sensíveis (plaintext) através de testes determinísticos de exfiltração [8]. 

Em total conformidade com as restrições do Gate 0 [2], este ciclo de desenvolvimento adota uma abordagem de prototipação exploratória e descartável [3, 8]. Toda a custódia e execução ocorrerão em memória, utilizando dados sintéticos (fixtures) e credenciais descartáveis [3]. Não haverá integração com KMS/HSM reais, provedores de nuvem ou bancos de dados persistentes nesta fase, postergando essas decisões para o momento adequado de encerramento do Gate 0 [2, 8].

## 2. Contexto Técnico (Technical Context)
* **Linguagem**: TypeScript 5.x sobre Node.js 20+ (garante tipagem estática forte para a API estreita e contratos de domínio) [72, 224].
* **Frameworks/Bibliotecas**: Nenhuma dependência externa de framework web (como Express ou Fastify) será adicionada na camada de domínio para preservar a simplicidade (YAGNI) e o agnosticismo tecnológico [123, 124].
* **Persistência**: Armazenamento efêmero exclusivamente em memória (`InMemoryAtivoRepository`), simulando o comportamento de um custodiante seguro sem persistência física em disco [3, 8].
* **Testes**: Suíte de testes automatizados com **Vitest** (comprovando isolamento do domínio, validação de regras de negócio e testes determinísticos de exfiltração antes de gerar qualquer código de produção) [123, 224].
* **Plataforma alvo**: Sandbox local isolada (sem acesso à rede) [3, 8].

## 3. Constitution Check (Conformidade com a Constituição)
O plano é confrontado diretamente com os princípios estabelecidos na Constituição do projeto para garantir conformidade arquitetural [156, 169]:

| Princípio Constitucional | Como o plano atende |
| :--- | :--- |
| **I. Arquitetura em Camadas** [123] | O projeto é estruturado em três camadas independentes: `domain` (TypeScript puro), `data` (implementações do repositório em memória) e `presentation` (API estreita e adaptadores) [127, 225]. As dependências apontam estritamente para o domínio, com composição na borda (`main.ts`) [127, 225]. |
| **II. Lógica de Negócio Isolada** [123] | A validação das políticas de processamento e a execução de ativos lógicos protegidos ocorrem exclusivamente nos use cases de domínio [123]. Nenhum componente externo (como a CLI ou testes) acessa o payload protegido diretamente [3]. |
| **III. Erro como Valor** [123] | Todas as operações falhas previsíveis de validação, expiração ou assinatura retornam uma estrutura explícita `Result.failure(failure)` [123, 224], forçando o tratamento de erros exaustivo no TypeScript e eliminando o vazamento de exceções brutas [123]. |
| **IV. Desenvolvimento Guiado por Testes (TDD)** [123] | A suíte de testes de Vitest é escrita na fase vermelha (Red) antes do código de produção [53]. Inclui especificamente os testes determinísticos de exfiltração monitorando buffers e logs em tempo de execução [8]. |
| **V. Simplicidade (YAGNI)** [123] | Foco estrito em dados sintéticos e credenciais descartáveis [3]. Provedores de nuvem, persistência relacional e HSMs reais estão fora de escopo até o encerramento formal do Gate 0 [2, 8]. |
| **VI. Agnosticismo Tecnológico** [123] | A especificação funcional não cita TypeScript, Node ou Vitest [72, 128]. Essas escolhas pertencem apenas a este plano de implementação técnica [128, 140]. |

## 4. Estrutura do Projeto (Project Structure)
A branch `001-thin-slice-sintetico` conterá a seguinte estrutura de arquivos no repositório [225]:

```
cofrefd/
├── .specify/
│   └── memory/
│       └── specs/
│           └── 001-thin-slice-sintetico/
│               ├── spec.md                   # Especificação Funcional Agnóstica
│               └── plan.md                   # Este Plano Técnico de Implementação
├── src/
│   ├── domain/
│   │   ├── result.ts                         # Tipo genérico Result<S, F> para erro como valor
│   │   ├── entities/
│   │   │   └── ativo.ts                      # Definição do Ativo Lógico Protegido
│   │   ├── failures/
│   │   │   └── processamento-failure.ts      # Tipos de falha previsíveis de processamento
│   │   ├── repositories/
│   │   │   └── ativo-repository.ts           # Interface (Porta) de custódia do Cofre
│   │   └── usecases/
│   │       └── processar-ativo.ts            # Use case do executor isolado na sandbox
│   ├── data/
│   │   └── in-memory-ativo-repository.ts     # Custodiante em memória com dados sintéticos
│   ├── presentation/
│   │   └── narrow-api.ts                     # API estreita e tipada (Adaptador de entrada)
│   └── main.ts                               # Ponto de composição na borda (Injeção de dependência)
└── test/
    ├── domain/
    │   └── processar-ativo.test.ts           # Testes unitários do Use Case (TDD)
    ├── data/
    │   └── in-memory-ativo-repository.test.ts # Testes do repositório em memória
    └── security/
        └── exfiltracao.test.ts               # Testes determinísticos de exfiltração
```

## 5. Decisões de "Como" (Technical Decisions)

### D1 - Minimização de Contexto e API Estreita (Narrow API)
* **Decisão**: A `narrow-api.ts` atuará como um intermediário estrito entre o FD-Core simulado e o executor seguro. Ela não expõe endpoints genéricos de leitura/escrita.
* **Mecanismo**: A API aceita apenas chamadas contendo uma referência lógica opaca (UUID gerado de forma sintética) e um contexto minimizado [5, 8]. Ela retorna apenas o veredito tipado (sucesso ou falha estruturada) [123]. O plaintext do ativo lógico protegido nunca cruza a fronteira dessa API [3, 8].
* **Alternativas descartadas**: Passar o payload completo para o processamento a cada requisição (vulnerável a ataques de interceptação de canal).

### D2 - Custódia Efêmera e Isolamento do Plaintext
* **Decisão**: O `in-memory-ativo-repository.ts` manterá os ativos protegidos encapsulados, expondo apenas métodos de verificação de integridade e processamento sob demanda, sem expor métodos de "getPayload" ou acesso livre aos dados puros [3].
* **Mecanismo**: Ao realizar um processamento, a decodificação do ativo sintético ocorre estritamente dentro da memória volátil da sandbox do executor (`processar-ativo.ts`), sendo descartada imediatamente após a computação da política associada [5]. Nenhuma variável mantém referência ao plaintext em escopo global ou de classe.

### D3 - Testes Determinísticos de Exfiltração de Logs e Erros
* **Decisão**: Implementar uma suíte de testes de segurança automatizados que intercepta e avalia as saídas padrão e buffers durante falhas forçadas de segurança [8].
* **Mecanismo**: 
  1. **Exfiltração de Logs**: Os testes no `exfiltracao.test.ts` utilizarão listeners e spies do Vitest (como `vi.spyOn(console, 'log')` e `vi.spyOn(process.stdout, 'write')`) para monitorar todas as tentativas de gravação durante a simulação de transações do cofre [224]. O teste injetará strings de controle exclusivas ("PLAINTEXT_SECRET_FLAG") nos payloads sintéticos e validará por asserções rígidas de string que nenhuma dessas flags de controle foi impressa nos canais de saída ou buffers de dump (comprovando zero bytes de exfiltração) [8].
  2. **Exfiltração de Erros**: O teste submeterá solicitações mal-intencionadas com assinaturas corrompidas ou referências inválidas. A asserção validará que o resultado de falha retornado pela API estreita é estritamente tipado (ex: `Result.failure({ kind: "invalid-signature" })`) [224], e que nenhum metadado não autorizado ou fragmento do conteúdo confidencial foi concatenado à estrutura de retorno de erro [5].

## 6. Rastreabilidade Clarify/Spec -> Plano
Esta seção mapeia os requisitos funcionais e cenários da especificação funcional (`spec.md`) diretamente para os componentes técnicos e arquiteturais do plano de implementação:

| Requisito Funcional (Spec) | Cenário de Aceite (Spec) | Componente Técnico / Decisão de Como |
| :--- | :--- | :--- |
| **FR-001 (API Estreita)** | **SC-001** (Processamento com referências lógicas opacas) | Implementação do adaptador `narrow-api.ts` utilizando exclusivamente IDs sintéticos e parâmetros tipados de domínio [225]. |
| **FR-002 (Processamento Isolado)** | **SC-001** (Processamento efêmero sem vazamento de plaintext) | Lógica de execução efêmera encapsulada no Use Case `processar-ativo.ts` com limpeza de escopo volátil [3, 5]. |
| **FR-003 (Prevenção de Exfiltração)** | **SC-002** (Tentativa de vazamento de plaintext em logs padrão) | Criação da suite de monitoramento de logs e dumps `exfiltracao.test.ts` utilizando spies determinísticos [8, 225]. |
| **FR-004 (Erro como Valor)** | **SC-003** (Resposta tipada a transações negadas ou inválidas) | Uso do tipo genérico unificado de retorno `Result<S, F>` definido em `src/domain/result.ts` [123, 225]. |

## 7. Modelos de Domínio e Contratos (Data Model & Contracts)

### A. Estrutura de Ativo Lógico Protegido (TypeScript Puro)
```typescript
// src/domain/entities/ativo.ts
export type AtivoLogicoProtegido = {
  readonly id: string;               // UUID sintético descartável [3]
  readonly chaveReferencia: string;  // Identificador opaco de referência externa [3]
  readonly hashPolitica: string;     // Hash SHA-256 de validação de políticas autorizadas [4]
  readonly payloadCifrado: string;   // Conteúdo protegido de fixture sintética [3]
  readonly createdAt: string;        // ISO 8601 para controle temporal do ciclo efêmero [5]
};
```

### B. O Erro como Valor (TypeScript Puro)
```typescript
// src/domain/result.ts
export type Result<S, F> =
  | { readonly kind: "success"; readonly value: S }
  | { readonly kind: "failure"; readonly error: F };

export const success = <S, F>(value: S): Result<S, F> => ({ kind: "success", value });
export const failure = <S, F>(error: F): Result<S, F> => ({ kind: "failure", error });
```

### C. Contrato do Repositório de Custódia (TypeScript Puro)
```typescript
// src/domain/repositories/ativo-repository.ts
import type { AtivoLogicoProtegido } from "../entities/ativo";

export interface AtivoRepository {
  /** Busca um ativo protegido estritamente por sua referência lógica opaca */
  buscarPorReferencia(referenciaOpaca: string): Promise<AtivoLogicoProtegido | null>;
  
  /** Salva uma nova fixture sintética de teste na sandbox */
  salvarSintetico(ativo: AtivoLogicoProtegido): Promise<void>;
}
```

### D. Use Case de Processamento de Ativo (Domínio)
```typescript
// src/domain/usecases/processar-ativo.ts
import type { Result } from "../result";
import type { AtivoRepository } from "../repositories/ativo-repository";
import type { ProcessamentoFailure } from "../failures/processamento-failure";

export type ProcessarAtivoInput = {
  readonly referenciaOpaca: string;
  readonly assinaturaValidacao: string;
};

export type ProcessarAtivoOutput = {
  readonly veredito: "autorizado" | "negado";
  readonly timestampExecucao: string;
};

export interface ProcessarAtivoUseCase {
  executar(input: ProcessarAtivoInput): Promise<Result<ProcessarAtivoOutput, ProcessamentoFailure>>;
}
```
