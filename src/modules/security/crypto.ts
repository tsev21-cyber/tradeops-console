import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

/**
 * Credential encryption — AES-256-GCM envelope encryption.
 *
 * Demonstrates how exchange API secrets are protected at rest:
 *   - a random 256-bit DATA KEY encrypts the secret (AES-256-GCM, authenticated)
 *   - the data key is itself wrapped by a MASTER KEY
 *   - only the encrypted blob + wrapped data key are ever persisted
 *
 * In production the master key never lives in the app: the wrap/unwrap step is
 * performed by a KMS (AWS KMS / HashiCorp Vault), so plaintext keys exist only
 * in memory for the moment of an exchange call. Here the master key is derived
 * locally for demonstration only.
 */

// Demo master key. In production this is a KMS-managed key, never in code/env.
const MASTER_KEY = process.env.VAULT_MASTER_KEY
  ? Buffer.from(process.env.VAULT_MASTER_KEY, "base64")
  : scryptSync("tradeops-demo-master-passphrase", "tradeops-demo-salt", 32);

const ALGO = "aes-256-gcm";

export interface SealedSecret {
  ciphertext: string; // base64 — the encrypted secret
  iv: string; // base64 — random nonce for the secret
  authTag: string; // base64 — GCM authentication tag
  wrappedDataKey: string; // base64 — data key encrypted under the master key
  keyIv: string; // base64 — nonce used to wrap the data key
  keyAuthTag: string; // base64
}

function gcmEncrypt(key: Buffer, plaintext: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { iv, ciphertext, authTag };
}

function gcmDecrypt(key: Buffer, iv: Buffer, ciphertext: Buffer, authTag: Buffer) {
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/** Encrypt a secret using a fresh data key, then wrap that key under the master key. */
export function seal(plaintext: string): SealedSecret {
  const dataKey = randomBytes(32);
  const secret = gcmEncrypt(dataKey, Buffer.from(plaintext, "utf8"));
  const wrapped = gcmEncrypt(MASTER_KEY, dataKey);
  return {
    ciphertext: secret.ciphertext.toString("base64"),
    iv: secret.iv.toString("base64"),
    authTag: secret.authTag.toString("base64"),
    wrappedDataKey: wrapped.ciphertext.toString("base64"),
    keyIv: wrapped.iv.toString("base64"),
    keyAuthTag: wrapped.authTag.toString("base64"),
  };
}

/** Reverse of seal(): unwrap the data key, then decrypt the secret. Verifies round-trip. */
export function open(s: SealedSecret): string {
  const dataKey = gcmDecrypt(
    MASTER_KEY,
    Buffer.from(s.keyIv, "base64"),
    Buffer.from(s.wrappedDataKey, "base64"),
    Buffer.from(s.keyAuthTag, "base64"),
  );
  const plaintext = gcmDecrypt(
    dataKey,
    Buffer.from(s.iv, "base64"),
    Buffer.from(s.ciphertext, "base64"),
    Buffer.from(s.authTag, "base64"),
  );
  return plaintext.toString("utf8");
}
