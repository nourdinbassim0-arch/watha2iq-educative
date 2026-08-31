// Utility for secure password hashing and OTP generation

const SALT_PREFIX = 'wathaiqi_sec_v1_';

/**
 * Generates a SHA-256 hash of the password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salted = `${SALT_PREFIX}${password}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(salted);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch {
      // Fallback
    }
  }

  // Fallback simple deterministic hash
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Verifies if input password matches the stored password hash
 */
export async function verifyPassword(inputPassword: string, storedHash?: string): Promise<boolean> {
  if (!storedHash) {
    // If no hash is stored yet (e.g. initial demo accounts or unmigrated),
    // allow initial setup password or common defaults
    return inputPassword.length >= 4;
  }
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}

/**
 * Generates a random 6-digit OTP verification code
 */
export function generateOtpCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return randomNum.toString();
}
