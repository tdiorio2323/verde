/**
 * Form validation utilities.
 * Provides reusable validation functions for common input types.
 */

// ========================================
// VALIDATION RULES
// ========================================

const PHONE_REGEX = /^\d{3}-?\d{3}-?\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Validate a name field (minimum 2 characters)
 */
export function validateName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }
  return "";
}

/**
 * Validate a phone number (US format: XXX-XXX-XXXX or XXXXXXXXXX)
 */
export function validatePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!PHONE_REGEX.test(trimmed)) {
    return "Please enter a valid phone number";
  }
  return "";
}

/**
 * Validate an email address
 */
export function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address";
  }
  return "";
}

/**
 * Validate a delivery address (minimum 6 characters)
 */
export function validateAddress(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length < 6) {
    return "Please enter a complete delivery address";
  }
  return "";
}

/**
 * Validate a required field
 */
export function validateRequired(value: string, fieldName = "This field"): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return `${fieldName} is required`;
  }
  return "";
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName = "This field"
): string {
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return "";
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName = "This field"
): string {
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return "";
}

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Check if any validation errors exist in an errors object
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.values(errors).some((error) => error.length > 0);
}

/**
 * Get the first error message from an errors object
 */
export function getFirstError(errors: Record<string, string>): string {
  return Object.values(errors).find((error) => error.length > 0) ?? "";
}
