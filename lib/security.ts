import crypto from 'crypto';
const key=()=>crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY||'dev-only-key').digest();
export function encryptSecret(value:string){const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',key(),iv);const enc=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),enc]).toString('base64');}
export function decryptSecret(value:string){const raw=Buffer.from(value,'base64');const iv=raw.subarray(0,12),tag=raw.subarray(12,28),enc=raw.subarray(28);const decipher=crypto.createDecipheriv('aes-256-gcm',key(),iv);decipher.setAuthTag(tag);return decipher.update(enc)+decipher.final('utf8');}
export const privacyDisclosure='Tokens and IMAP/CalDAV passwords are encrypted at rest. Email bodies are never logged. Disconnecting a source deletes stored credentials.';
