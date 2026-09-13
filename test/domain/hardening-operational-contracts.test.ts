import { describe, expect, it } from "vitest";
import {
  createAttestationEvidence,
  createKeyAuthorizationRequest,
  createServiceIdentity,
  createOperationalEvidence,
  isValidOperationalTransition,
} from "../../src/domain/contracts/hardening-operational";

describe("contratos de hardening operacional", () => {
  it("deve criar evidência de attestation sem aceitar medição vazia", () => {
    expect(() => createAttestationEvidence({
      provider: "tpm-measured-boot",
      measurement: "sha256:microvm-measurement",
      verifiedAt: "2026-09-13T10:00:00.000Z",
    })).not.toThrow();

    expect(() => createAttestationEvidence({
      provider: "tpm-measured-boot",
      measurement: "",
      verifiedAt: "2026-09-13T10:00:00.000Z",
    })).toThrow();
  });

  it("deve vincular autorização de chave a identidade, pacote e request único", () => {
    const request = createKeyAuthorizationRequest({
      executorId: "executor-microvm-001",
      codeHash: "sha256:code",
      imageHash: "sha256:image",
      environmentMeasurement: "sha256:measurement",
      packageHash: "sha256:package",
      requestId: "request-001",
      audience: "cofre-sandbox",
      expiresAt: "2026-09-13T10:05:00.000Z",
    });

    expect(request.requestId).toBe("request-001");
    expect(request.packageHash).toBe("sha256:package");
    expect(() => createKeyAuthorizationRequest({ ...request, requestId: "" })).toThrow();
  });

  it("deve separar identidades e restringir transições operacionais", () => {
    const identity = createServiceIdentity({
      serviceId: "executor-001",
      role: "executor",
      certificateFingerprint: "sha256:certificate",
    });

    expect(identity.role).toBe("executor");
    expect(isValidOperationalTransition("quarentena", "validando")).toBe(true);
    expect(isValidOperationalTransition("quarentena", "executando")).toBe(false);
    expect(() => createServiceIdentity({
      serviceId: "admin-001",
      role: "administrator",
      certificateFingerprint: "sha256:certificate",
    })).not.toThrow();
  });

  it("deve classificar evidência por ambiente sem confundir laboratório com produção", () => {
    const evidence = createOperationalEvidence({
      control: "firewall-deny-by-default",
      environment: "synthetic-lab",
      command: "test-egress",
      result: "blocked",
    });

    expect(evidence.environment).toBe("synthetic-lab");
    expect(evidence.classification).toBe("demonstrated-controlled-environment");
  });
});
