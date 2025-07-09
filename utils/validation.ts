export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validator {
  static validateField(value: any, rule: ValidationRule): string | null {
    // Required check
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required';
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    const stringValue = String(value).trim();

    // Min length check
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }

    // Max length check
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`;
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  static validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, rule] of Object.entries(schema)) {
      const error = this.validateField(data[field], rule);
      if (error) {
        errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  url: /^https?:\/\/.+/,
} as const;

// Common validation schemas
export const AuthValidationSchemas = {
  login: {
    email: {
      required: true,
      pattern: ValidationPatterns.email,
    },
    password: {
      required: true,
      minLength: 6,
    },
  } satisfies ValidationSchema,

  register: {
    email: {
      required: true,
      pattern: ValidationPatterns.email,
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: ValidationPatterns.username,
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value: string) => {
        if (!ValidationPatterns.password.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return null;
      },
    },
    confirmPassword: {
      required: true,
      custom: (value: string, data?: Record<string, any>) => {
        if (data && value !== data.password) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
    full_name: {
      maxLength: 100,
    },
  } satisfies ValidationSchema,
} as const;

// Validation helpers
export const ValidationHelpers = {
  isEmail: (email: string): boolean => ValidationPatterns.email.test(email),
  isPhone: (phone: string): boolean => ValidationPatterns.phone.test(phone),
  isStrongPassword: (password: string): boolean => ValidationPatterns.password.test(password),
  isValidUsername: (username: string): boolean => ValidationPatterns.username.test(username),
  isUrl: (url: string): boolean => ValidationPatterns.url.test(url),
};