const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

// Generate an encryption key from the user's password
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate a random salt
function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// Generate a random IV
function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

// Convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

// Convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptEntry(text: string, password: string): Promise<{
  encryptedData: string;
  salt: string;
  iv: string;
}> {
  const encoder = new TextEncoder();
  const salt = generateSalt();
  const iv = generateIV();
  const key = await getKey(password, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    encoder.encode(text)
  );

  return {
    encryptedData: arrayBufferToBase64(encryptedBuffer),
    salt: arrayBufferToBase64(salt),
    iv: arrayBufferToBase64(iv)
  };
}

export async function decryptEntry(
  encryptedData: string,
  password: string,
  salt: string,
  iv: string
): Promise<string> {
  const decoder = new TextDecoder();
  const key = await getKey(password, new Uint8Array(base64ToArrayBuffer(salt)));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: new Uint8Array(base64ToArrayBuffer(iv))
    },
    key,
    base64ToArrayBuffer(encryptedData)
  );

  return decoder.decode(decryptedBuffer);
}

// Generate a secure key for new users
export async function generateEncryptionKey(): Promise<string> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
} 