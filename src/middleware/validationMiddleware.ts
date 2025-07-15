import { Request, Response, NextFunction } from 'express';

interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  message: string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { [key: string]: string } = {};

    rules.forEach(rule => {
      const value = req.body[rule.field];
      if (!rule.validate(value)) {
        errors[rule.field] = rule.message;
      }
    });

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors });
      return;
    }

    next();
  };
};

// Common validation rules
export const emailValidator = (value: any): boolean => {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const passwordValidator = (value: any): boolean => {
  if (!value || typeof value !== 'string') return false;
  return value.length >= 6;
};

// Pre-defined validation sets
export const authValidationRules: ValidationRule[] = [
  {
    field: 'email',
    validate: emailValidator,
    message: 'Please provide a valid email address'
  },
  {
    field: 'password',
    validate: passwordValidator,
    message: 'Password must be at least 6 characters long'
  }
];

export const waitlistValidationRules: ValidationRule[] = [
  {
    field: 'name',
    validate: (value: any): boolean => {
      if (!value || typeof value !== 'string') return false;
      return value.trim().length > 0;
    },
    message: 'Name is required'
  },
  {
    field: 'email',
    validate: emailValidator,
    message: 'Please provide a valid email address'
  }
];
