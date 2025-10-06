// Client-side encryption utilities for sensitive data
export class EncryptionUtils {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  // Generate a random encryption key
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt data
  static async encrypt(data: string, key: CryptoKey): Promise<{
    encrypted: ArrayBuffer;
    iv: Uint8Array;
  }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = this.encoder.encode(data);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    return { encrypted, iv };
  }

  // Decrypt data
  static async decrypt(
    encryptedData: ArrayBuffer,
    key: CryptoKey,
    iv: Uint8Array
  ): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    return this.decoder.decode(decrypted);
  }

  // Hash sensitive data for comparison (one-way)
  static async hashData(data: string): Promise<string> {
    const encodedData = this.encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Generate a secure random token
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Securely compare two strings (timing-safe)
  static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}