import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY as string; // Must be 32 characters

function hasValidKey(): boolean {
  const key = process.env.ENCRYPTION_KEY as string;

  if (!key) {
    return false;
  }

  return Buffer.from(key, "hex").length === 32;
}

if (!hasValidKey()) {
  const suggestedKey = crypto.randomBytes(32).toString("hex");

  console.warn(
    `ENCRYPTION_KEY not set, please set it in your environment variables. Here's a suggested key: ${suggestedKey}`
  );
}

export function encrypt(text: string): string {
  if (!hasValidKey()) {
    console.warn("ENCRYPTION_KEY not set, skipping encryption");
    return text;
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string) {
  if (!hasValidKey()) {
    console.warn("ENCRYPTION_KEY not set, skipping decryption");
    return text;
  }

  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "hex"), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
