type CertificateRecord = Readonly<{
  fingerprint: string;
  active: boolean;
}>;

export type CertificateRotation = Readonly<{
  serviceId: string;
  activeFingerprint: string;
  previousFingerprint: string;
}>;

export class CertificateRegistry {
  private readonly records = new Map<string, CertificateRecord>();

  register(serviceId: string, fingerprint: string): void {
    this.records.set(serviceId, { fingerprint, active: true });
  }

  rotate(serviceId: string, fingerprint: string): CertificateRotation {
    const current = this.records.get(serviceId);
    if (!current) {
      throw new Error(`service ${serviceId} is not registered`);
    }

    this.records.set(serviceId, { fingerprint, active: true });
    return {
      serviceId,
      activeFingerprint: fingerprint,
      previousFingerprint: current.fingerprint,
    };
  }

  revoke(serviceId: string, fingerprint: string): void {
    const current = this.records.get(serviceId);
    if (current?.fingerprint === fingerprint) {
      this.records.set(serviceId, { ...current, active: false });
    }
  }

  isActive(serviceId: string, fingerprint: string): boolean {
    const current = this.records.get(serviceId);
    return current?.fingerprint === fingerprint && current.active;
  }
}
