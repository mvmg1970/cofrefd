import { describe, expect, it } from "vitest";
import {
  isApprovedScannerDestination,
  validateScannerDestination,
} from "../../src/application/cofre/scanner-boundary";

describe("fronteira de scanners", () => {
  it("deve aceitar somente scanner local ou interno ao Cofre", () => {
    expect(isApprovedScannerDestination("cofre-internal-scanner")).toBe(true);
    expect(isApprovedScannerDestination("localhost-synthetic-scanner")).toBe(true);
  });

  it("deve rejeitar serviços públicos e destinos externos", () => {
    expect(isApprovedScannerDestination("public-analysis-service")).toBe(false);
    expect(isApprovedScannerDestination("https://scanner.example.com")).toBe(false);
    expect(validateScannerDestination("public-analysis-service")).toEqual({
      approved: false,
      reason: "external-scanner-forbidden",
    });
  });

  it("deve retornar decisão tipada para destino interno", () => {
    expect(validateScannerDestination("cofre-internal-scanner")).toEqual({
      approved: true,
      reason: "internal-scanner-approved",
    });
  });
});
