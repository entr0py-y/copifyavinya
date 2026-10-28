// Cryptographically secure code generator for Copify
// Excludes ambiguous characters: 0, O, 1, I, 5, S

const ALPHABET = '2346789ABCDEFGHJKLMNPQRTUVWXYZ';
const CODE_LENGTH = 5;

/**
 * Generates a cryptographically secure alphanumeric code
 * using rejection sampling to avoid modulo bias.
 */
export function generateCode(): string {
  const alphabetLength = ALPHABET.length;
  const mask = (2 << (31 - Math.clz32(alphabetLength - 1))) - 1;
  const step = Math.ceil((1.6 * mask * CODE_LENGTH) / alphabetLength);

  let result = '';
  while (result.length < CODE_LENGTH) {
    const bytes = new Uint8Array(step);
    crypto.getRandomValues(bytes);

    for (let i = 0; i < bytes.length && result.length < CODE_LENGTH; i++) {
      const byte = bytes[i] & mask;
      if (byte < alphabetLength) {
        result += ALPHABET[byte];
      }
    }
  }

  return result;
}

/**
 * Validates that a string is a valid Copify code format.
 */
export function isValidCodeFormat(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  return code.split('').every((char) => ALPHABET.includes(char));
}

export const MAX_CONTENT_LENGTH = 50_000;
export const EXPIRY_MINUTES = 10;
