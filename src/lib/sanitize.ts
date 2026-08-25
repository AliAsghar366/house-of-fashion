/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 * Used across all forms to clean user input before storage/display.
 */

// Strip HTML tags and dangerous characters
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/javascript:/gi, "") // strip JS protocol
    .replace(/on\w+\s*=/gi, "") // strip inline event handlers
    .replace(/data:/gi, "") // strip data URIs
    .replace(/vbscript:/gi, "") // strip vbscript
    .trim()
    .slice(0, maxLength);
}

// Sanitize email
export function sanitizeEmail(input: string): string {
  const clean = input.trim().toLowerCase().slice(0, 200);
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return "";
  return clean;
}

// Sanitize phone number - allow only digits, +, -, spaces, (, )
export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20);
}

// Sanitize name - strip everything except letters, spaces, hyphens, apostrophes
export function sanitizeName(input: string): string {
  return input.replace(/[^a-zA-Z\s'\-]/g, "").trim().slice(0, 100);
}

// Sanitize a URL - only allow http/https protocols
export function sanitizeUrl(input: string): string {
  const clean = input.trim();
  if (/^https?:\/\//.test(clean)) return clean.slice(0, 500);
  return "";
}

// Escape HTML entities for safe rendering
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// General-purpose input cleaner
export function cleanInput(input: string, options?: {
  maxLength?: number;
  allowHtml?: boolean;
  type?: "text" | "email" | "phone" | "name" | "url" | "number";
}): string {
  const { maxLength = 500, type = "text" } = options || {};

  switch (type) {
    case "email": return sanitizeEmail(input);
    case "phone": return sanitizePhone(input);
    case "name": return sanitizeName(input);
    case "url": return sanitizeUrl(input);
    case "number": return input.replace(/[^0-9.\-]/g, "").slice(0, 20);
    default: return sanitizeText(input, maxLength);
  }
}
