/**
 * Security & Sanitization utilities for input validation and XSS prevention.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML strings to strictly prevent XSS attacks while keeping permitted formatting.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'br', 'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'
    ],
    ALLOWED_ATTR: ['href', 'style', 'class', 'dir', 'align', 'target', 'rel'],
  });
}

/**
 * Validates an email address format safely.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength (minimum 6 characters for Firebase Auth).
 */
export function isStrongPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 6;
}
