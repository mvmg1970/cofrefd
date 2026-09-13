export type AttestationProvider = "tpm-measured-boot";

export type AttestationEvidence = {
  provider: AttestationProvider;
  measurement: string;
  verifiedAt: string;
};

export type KeyAuthorizationRequest = {
  executorId: string;
  codeHash: string;
  imageHash: string;
  environmentMeasurement: string;
  packageHash: string;
  requestId: string;
  audience: "cofre-sandbox";
  expiresAt: string;
};

export type ServiceRole = "curator" | "operator" | "administrator" | "gateway" | "custody" | "executor";

export type ServiceIdentity = {
  serviceId: string;
  role: ServiceRole;
  certificateFingerprint: string;
};

export type OperationalEnvironment = "synthetic-lab" | "productive-equivalent" | "production";

export type EvidenceClassification =
  | "implemented-in-code"
  | "demonstrated-controlled-environment"
  | "proven-productive-equivalent";

export type OperationalEvidence = {
  control: string;
  environment: OperationalEnvironment;
  command: string;
  result: string;
  classification: EvidenceClassification;
};

export type OperationalState =
  | "quarentena"
  | "validando"
  | "pendente-aprovacao"
  | "autorizado"
  | "executando"
  | "concluido"
  | "rejeitado";

const required = (value: string, field: string): string => {
  if (!value.trim()) throw new Error(`${field} is required`);
  return value;
};

export const createAttestationEvidence = (input: AttestationEvidence): AttestationEvidence => ({
  provider: input.provider,
  measurement: required(input.measurement, "measurement"),
  verifiedAt: required(input.verifiedAt, "verifiedAt"),
});

export const createKeyAuthorizationRequest = (
  input: KeyAuthorizationRequest,
): KeyAuthorizationRequest => ({
  executorId: required(input.executorId, "executorId"),
  codeHash: required(input.codeHash, "codeHash"),
  imageHash: required(input.imageHash, "imageHash"),
  environmentMeasurement: required(input.environmentMeasurement, "environmentMeasurement"),
  packageHash: required(input.packageHash, "packageHash"),
  requestId: required(input.requestId, "requestId"),
  audience: input.audience,
  expiresAt: required(input.expiresAt, "expiresAt"),
});

export const createServiceIdentity = (input: ServiceIdentity): ServiceIdentity => ({
  serviceId: required(input.serviceId, "serviceId"),
  role: input.role,
  certificateFingerprint: required(input.certificateFingerprint, "certificateFingerprint"),
});

export const createOperationalEvidence = (
  input: Omit<OperationalEvidence, "classification">,
): OperationalEvidence => ({
  ...input,
  classification: input.environment === "synthetic-lab"
    ? "demonstrated-controlled-environment"
    : input.environment === "productive-equivalent"
      ? "proven-productive-equivalent"
      : "proven-productive-equivalent",
});

const transitions: Record<OperationalState, readonly OperationalState[]> = {
  quarentena: ["validando", "rejeitado"],
  validando: ["pendente-aprovacao", "rejeitado"],
  "pendente-aprovacao": ["autorizado", "rejeitado"],
  autorizado: ["executando", "rejeitado"],
  executando: ["concluido", "rejeitado"],
  concluido: [],
  rejeitado: [],
};

export const isValidOperationalTransition = (
  from: OperationalState,
  to: OperationalState,
): boolean => transitions[from].includes(to);
