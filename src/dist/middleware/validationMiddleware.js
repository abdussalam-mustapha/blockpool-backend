"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitlistValidationRules = exports.authValidationRules = exports.passwordValidator = exports.emailValidator = exports.validateRequest = void 0;
const validateRequest = (rules) => {
    return (req, res, next) => {
        const errors = {};
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
exports.validateRequest = validateRequest;
// Common validation rules
const emailValidator = (value) => {
    if (!value || typeof value !== 'string')
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
exports.emailValidator = emailValidator;
const passwordValidator = (value) => {
    if (!value || typeof value !== 'string')
        return false;
    return value.length >= 6;
};
exports.passwordValidator = passwordValidator;
// Pre-defined validation sets
exports.authValidationRules = [
    {
        field: 'email',
        validate: exports.emailValidator,
        message: 'Please provide a valid email address'
    },
    {
        field: 'password',
        validate: exports.passwordValidator,
        message: 'Password must be at least 6 characters long'
    }
];
exports.waitlistValidationRules = [
    {
        field: 'name',
        validate: (value) => {
            if (!value || typeof value !== 'string')
                return false;
            return value.trim().length > 0;
        },
        message: 'Name is required'
    },
    {
        field: 'email',
        validate: exports.emailValidator,
        message: 'Please provide a valid email address'
    }
];
