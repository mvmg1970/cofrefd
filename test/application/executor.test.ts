import { describe, expect, it } from "vitest";
import {
  createSyntheticExecutor,
  executeInExecutor,
} from "../../src/application/cofre/executor";

describe("executor isolado", () => {
  it("deve executar somente com ambiente atestado e limites restritivos", () => {
    const executor = createSyntheticExecutor({
      attested: true,
      networkEnabled: false,
      filesystem: "ephemeral",
      memoryMb: 128,
      cpuLimit: 1,
      timeoutMs: 30_000,
    });

    expect(executeInExecutor(executor, "operacao-sintetica")).toEqual({
      executed: true,
      result: "synthetic-verdict",
    });
  });

  it("deve bloquear executor não atestado ou com rede habilitada", () => {
    expect(
      executeInExecutor(
        createSyntheticExecutor({
          attested: false,
          networkEnabled: false,
          filesystem: "ephemeral",
          memoryMb: 128,
          cpuLimit: 1,
          timeoutMs: 30_000,
        }),
        "operacao-sintetica",
      ),
    ).toEqual({ executed: false, reason: "executor-not-authorized" });

    expect(
      executeInExecutor(
        createSyntheticExecutor({
          attested: true,
          networkEnabled: true,
          filesystem: "ephemeral",
          memoryMb: 128,
          cpuLimit: 1,
          timeoutMs: 30_000,
        }),
        "operacao-sintetica",
      ),
    ).toEqual({ executed: false, reason: "network-not-allowed" });
  });
});
