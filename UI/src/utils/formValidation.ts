import { ValidationError } from "@/types/errors";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule | ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

/**
 * Form validation utility with error handling
 */
export class FormValidator {
  private readonly schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: any): string | null {
    const rules = this.schema[fieldName];
    if (!rules) return null;

    const rulesArray = Array.isArray(rules) ? rules : [rules];

    for (const rule of rulesArray) {
      const error = this.applyRule(fieldName, value, rule);
      if (error) return error;
    }

    return null;
  }

  /**
   * Validate entire form data
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate all fields in schema
    for (const fieldName in this.schema) {
      const error = this.validateField(fieldName, data[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstError: Object.values(errors)[0],
    };
  }

  /**
   * Validate and throw error if invalid
   */
  validateAndThrow(data: Record<string, any>): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new ValidationError("Form validation failed", result.errors);
    }
  }

  /**
   * Apply a single validation rule
   */
  private applyRule(
    fieldName: string,
    value: any,
    rule: ValidationRule
  ): string | null {
    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    // Required validation
    if (rule.required && this.isEmpty(value)) {
      return rule.message || `${this.formatFieldName(fieldName)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value)) {
      return null;
    }

    // String length validations
    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        return (
          rule.message ||
          `${this.formatFieldName(fieldName)} must be at least ${
            rule.minLength
          } characters`
        );
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return (
          rule.message ||
          `${this.formatFieldName(fieldName)} must be no more than ${
            rule.maxLength
          } characters`
        );
      }
    }

    // Numeric validations
    if (typeof value === "number") {
      if (rule.min !== undefined && value < rule.min) {
        return (
          rule.message ||
          `${this.formatFieldName(fieldName)} must be at least ${rule.min}`
        );
      }

      if (rule.max !== undefined && value > rule.max) {
        return (
          rule.message ||
          `${this.formatFieldName(fieldName)} must be no more than ${rule.max}`
        );
      }
    }

    // Pattern validation
    if (
      rule.pattern &&
      typeof value === "string" &&
      !rule.pattern.test(value)
    ) {
      return (
        rule.message || `${this.formatFieldName(fieldName)} format is invalid`
      );
    }

    // Email validation
    if (rule.email && typeof value === "string" && !this.isValidEmail(value)) {
      return (
        rule.message ||
        `${this.formatFieldName(fieldName)} must be a valid email address`
      );
    }

    // Phone validation
    if (rule.phone && typeof value === "string" && !this.isValidPhone(value)) {
      return (
        rule.message ||
        `${this.formatFieldName(fieldName)} must be a valid phone number`
      );
    }

    // URL validation
    if (rule.url && typeof value === "string" && !this.isValidUrl(value)) {
      return (
        rule.message || `${this.formatFieldName(fieldName)} must be a valid URL`
      );
    }

    return null;
  }

  /**
   * Check if value is empty
   */
  private isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  }

  /**
   * Format field name for error messages
   */
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Common validation rules
 */
export const commonValidations = {
  required: { required: true },
  email: { email: true, required: true },
  phone: { phone: true, required: true },
  url: { url: true },

  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message:
      "Password must be at least 8 characters with uppercase, lowercase, and number",
  },

  confirmPassword: (password: string) => ({
    required: true,
    custom: (value: string) =>
      value === password ? null : "Passwords do not match",
  }),

  positiveNumber: {
    min: 0,
    custom: (value: any) => {
      const num = Number(value);
      return isNaN(num) ? "Must be a valid number" : null;
    },
  },

  nonEmptyArray: {
    custom: (value: any[]) =>
      Array.isArray(value) && value.length > 0
        ? null
        : "At least one item is required",
  },
};

/**
 * Create form validator instance
 */
export const createValidator = (schema: ValidationSchema) => {
  return new FormValidator(schema);
};

/**
 * Validate form data with schema
 */
export const validateForm = (
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationResult => {
  const validator = new FormValidator(schema);
  return validator.validate(data);
};

/**
 * React hook for form validation
 */
export const useFormValidation = (schema: ValidationSchema) => {
  const validator = new FormValidator(schema);

  const validate = (data: Record<string, any>) => {
    return validator.validate(data);
  };

  const validateField = (fieldName: string, value: any) => {
    return validator.validateField(fieldName, value);
  };

  const validateAndThrow = (data: Record<string, any>) => {
    validator.validateAndThrow(data);
  };

  return {
    validate,
    validateField,
    validateAndThrow,
  };
};
