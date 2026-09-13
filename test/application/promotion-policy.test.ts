import { describe, expect, it } from "vitest";
import { evaluatePublicationAuthorization } from "../../src/application/cofre/promotion-policy";

describe("política de promoção entre ambientes", () => {
  it("deve permitir autoaprovação somente na sandbox sintética", () => {
    expect(
      evaluatePublicationAuthorization({
        source: "sandbox-sintetica",
        target: "sandbox-sintetica",
        curatorId: "curador-001",
        approverId: "curador-001",
      }),
    ).toEqual({ allowed: true, reason: "sandbox-self-approval" });
  });

  it("deve exigir aprovador independente para publicação produtiva", () => {
    expect(
      evaluatePublicationAuthorization({
        source: "quarentena",
        target: "producao",
        curatorId: "curador-001",
        approverId: "curador-001",
      }),
    ).toEqual({ allowed: false, reason: "independent-approver-required" });

    expect(
      evaluatePublicationAuthorization({
        source: "quarentena",
        target: "producao",
        curatorId: "curador-001",
        approverId: "aprovador-independente-001",
      }),
    ).toEqual({ allowed: true, reason: "independent-approval" });
  });

  it("deve bloquear promoção automática da sandbox para produção", () => {
    expect(
      evaluatePublicationAuthorization({
        source: "sandbox-sintetica",
        target: "producao",
        curatorId: "curador-001",
        approverId: "aprovador-independente-001",
      }),
    ).toEqual({ allowed: false, reason: "automatic-promotion-forbidden" });
  });
});
