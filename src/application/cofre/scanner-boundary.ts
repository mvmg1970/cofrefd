export type ScannerDecision = Readonly<{
  approved: boolean;
  reason: "internal-scanner-approved" | "external-scanner-forbidden";
}>;

const APPROVED_DESTINATIONS = new Set([
  "cofre-internal-scanner",
  "localhost-synthetic-scanner",
]);

export function isApprovedScannerDestination(destination: string): boolean {
  return APPROVED_DESTINATIONS.has(destination);
}

export function validateScannerDestination(destination: string): ScannerDecision {
  return isApprovedScannerDestination(destination)
    ? { approved: true, reason: "internal-scanner-approved" }
    : { approved: false, reason: "external-scanner-forbidden" };
}
