import {
  createCipheriv,
  createPublicKey,
  generateKeyPairSync,
  publicEncrypt,
  randomBytes,
  sign,
  verify,
} from "node:crypto";
import type { Manifest } from "../../domain/contracts/protected-package";

export type SyntheticProtectionKeys = Readonly<{
  signingPrivateKey: string;
  signingPublicKey: string;
  encryptionPrivateKey: string;
  encryptionPublicKey: string;
}>;

export type ProtectedTransmissionEnvelope = Readonly<{
  manifest: Manifest;
  ciphertext: string;
  authTag: string;
  iv: string;
  encryptedSessionKey: string;
  signature: string;
}>;

type ProtectionInput = Readonly<{
  content: string;
  manifest: Manifest;
  keys: SyntheticProtectionKeys;
}>;

function signedPayload(envelope: Omit<ProtectedTransmissionEnvelope, "signature">): string {
  return JSON.stringify({
    manifest: envelope.manifest,
    ciphertext: envelope.ciphertext,
    authTag: envelope.authTag,
    iv: envelope.iv,
    encryptedSessionKey: envelope.encryptedSessionKey,
  });
}

export function createSyntheticProtectionKeys(): SyntheticProtectionKeys {
  const signing = generateKeyPairSync("ed25519", {
    privateKeyEncoding: { format: "pem", type: "pkcs8" },
    publicKeyEncoding: { format: "pem", type: "spki" },
  });
  const encryption = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { format: "pem", type: "pkcs8" },
    publicKeyEncoding: { format: "pem", type: "spki" },
  });

  return Object.freeze({
    signingPrivateKey: signing.privateKey,
    signingPublicKey: signing.publicKey,
    encryptionPrivateKey: encryption.privateKey,
    encryptionPublicKey: encryption.publicKey,
  });
}

export function protectForTransmission(input: ProtectionInput): ProtectedTransmissionEnvelope {
  const sessionKey = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sessionKey, iv);
  const ciphertext = Buffer.concat([
    cipher.update(input.content, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const encryptedSessionKey = publicEncrypt(
    { key: input.keys.encryptionPublicKey, oaepHash: "sha256" },
    sessionKey,
  );

  const unsignedEnvelope = {
    manifest: input.manifest,
    ciphertext: ciphertext.toString("base64url"),
    authTag: authTag.toString("base64url"),
    iv: iv.toString("hex"),
    encryptedSessionKey: encryptedSessionKey.toString("base64url"),
  } satisfies Omit<ProtectedTransmissionEnvelope, "signature">;

  return Object.freeze({
    ...unsignedEnvelope,
    signature: sign(null, Buffer.from(signedPayload(unsignedEnvelope)), input.keys.signingPrivateKey).toString("base64url"),
  });
}

export function verifyProtectedEnvelope(
  envelope: ProtectedTransmissionEnvelope,
  signingPublicKey: string,
): boolean {
  const { signature, ...unsignedEnvelope } = envelope;
  return verify(
    null,
    Buffer.from(signedPayload(unsignedEnvelope)),
    createPublicKey(signingPublicKey),
    Buffer.from(signature, "base64url"),
  );
}
