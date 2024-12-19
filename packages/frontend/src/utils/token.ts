export function isValidToken(token: string): boolean {
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check expiration
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
} 