function isAllowedChar(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code === 9 || code === 10 || code === 13) {
    return true;
  }
  return code >= 32 && code !== 127;
}

export function sanitizeText(input: string, maxLength = 8000): string {
  let cleaned = '';
  for (const char of input) {
    if (isAllowedChar(char)) {
      cleaned += char;
    }
  }
  return cleaned.trim().slice(0, maxLength);
}

export function normalizePhone(input: string): string {
  return input.replace(/\D/g, '');
}

export function stripCommandPrefix(input: string): string {
  return input.trim().replace(/^\/+/, '');
}
