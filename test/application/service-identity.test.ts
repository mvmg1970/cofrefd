import { describe, expect, it } from "vitest";
import {
  authorizeServiceConnection,
  authorizeServicePeer,
  type ServiceConnectionRequest,
  type ServicePeerRequest,
} from "../../src/application/identity/service-identity";
import { CertificateRegistry } from "../../src/application/identity/certificate-registry";

const request = (overrides: Partial<ServiceConnectionRequest> = {}): ServiceConnectionRequest => ({
  caller: {
    serviceId: "gateway-01",
    role: "gateway",
    certificateFingerprint: "cert-gateway-01",
    certificateStatus: "active",
  },
  target: {
    serviceId: "custody-01",
    role: "custody",
    certificateFingerprint: "cert-custody-01",
    certificateStatus: "active",
  },
  presentedCertificateFingerprint: "cert-gateway-01",
  ...overrides,
});

describe("service identity and mTLS policy", () => {
  it("accepts an active certificate matching the caller identity", () => {
    expect(authorizeServiceConnection(request())).toEqual({
      allowed: true,
      reason: "connection-authorized",
    });
  });

  it("rejects a missing client certificate", () => {
    expect(authorizeServiceConnection(request({ presentedCertificateFingerprint: "" }))).toEqual({
      allowed: false,
      reason: "client-certificate-required",
    });
  });

  it("rejects expired or revoked certificates", () => {
    expect(authorizeServiceConnection(request({
      caller: { ...request().caller, certificateStatus: "expired" },
    }))).toEqual({ allowed: false, reason: "certificate-not-active" });

    expect(authorizeServiceConnection(request({
      caller: { ...request().caller, certificateStatus: "revoked" },
    }))).toEqual({ allowed: false, reason: "certificate-not-active" });
  });

  it("rejects a certificate presented for a different service", () => {
    expect(authorizeServiceConnection(request({
      presentedCertificateFingerprint: "cert-other-service",
    }))).toEqual({ allowed: false, reason: "certificate-identity-mismatch" });
  });

  it("rotates a certificate while preserving the service identity", () => {
    const registry = new CertificateRegistry();
    registry.register("gateway-01", "cert-gateway-old");

    expect(registry.rotate("gateway-01", "cert-gateway-new")).toEqual({
      serviceId: "gateway-01",
      activeFingerprint: "cert-gateway-new",
      previousFingerprint: "cert-gateway-old",
    });
    expect(registry.isActive("gateway-01", "cert-gateway-old")).toBe(false);
    expect(registry.isActive("gateway-01", "cert-gateway-new")).toBe(true);
  });

  it("revokes a certificate and rejects it thereafter", () => {
    const registry = new CertificateRegistry();
    registry.register("gateway-01", "cert-gateway-01");

    registry.revoke("gateway-01", "cert-gateway-01");

    expect(registry.isActive("gateway-01", "cert-gateway-01")).toBe(false);
  });

  it("allows only an explicitly trusted service pair", () => {
    const trusted: ServicePeerRequest = {
      callerRole: "gateway",
      targetRole: "custody",
    };
    const untrusted: ServicePeerRequest = {
      callerRole: "curator",
      targetRole: "executor",
    };

    expect(authorizeServicePeer(trusted)).toEqual({
      allowed: true,
      reason: "peer-authorized",
    });
    expect(authorizeServicePeer(untrusted)).toEqual({
      allowed: false,
      reason: "peer-not-authorized",
    });
  });

  it("rejects an unknown target role", () => {
    expect(authorizeServicePeer({
      callerRole: "gateway",
      targetRole: "administrator",
    })).toEqual({ allowed: false, reason: "peer-not-authorized" });
  });
});
