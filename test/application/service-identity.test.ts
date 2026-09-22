import { describe, expect, it } from "vitest";
import {
  authorizeServiceConnection,
  type ServiceConnectionRequest,
} from "../../src/application/identity/service-identity";

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
});
