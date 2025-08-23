// Security utilities for LifeMoments app

// Input sanitization
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
}

// Validate file uploads
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload audio files only.' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Please keep audio files under 10MB.' };
  }

  return { valid: true };
}

// Rate limiting for client-side
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Content filtering
export function containsInappropriateContent(text: string): boolean {
  if (!text) return false;
  
  // Basic content filtering - you might want to use a more sophisticated service
  const inappropriateWords = [
    // Add words you want to filter - keeping this minimal for family app
    'spam', 'scam'
  ];

  const lowerText = text.toLowerCase();
  return inappropriateWords.some(word => lowerText.includes(word));
}

// Validate memory title and content
export function validateMemoryContent(title: string, content?: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 100) {
    errors.push('Title must be less than 100 characters');
  } else if (containsInappropriateContent(title)) {
    errors.push('Title contains inappropriate content');
  }

  // Content validation (optional)
  if (content) {
    if (content.length > 5000) {
      errors.push('Content must be less than 5000 characters');
    } else if (containsInappropriateContent(content)) {
      errors.push('Content contains inappropriate content');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Privacy settings validation
export function validatePrivacySettings(visibility: string): boolean {
  const validSettings = ['private', 'family', 'public'];
  return validSettings.includes(visibility);
}

// User session validation
export function validateUserSession(userId?: string): boolean {
  return !!(userId && userId.length > 0);
}

// CSP (Content Security Policy) headers
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'microphone=*, camera=*, geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
};

// Audit logging for sensitive operations
export function logSecurityEvent(event: string, details: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY] ${event}:`, details);
  }
  
  // In production, you might want to send this to a security monitoring service
  // like Sentry, DataDog, or a custom logging endpoint
}
