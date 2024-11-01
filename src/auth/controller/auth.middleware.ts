
import { checkSchema } from "express-validator";


export const loginValidation = checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Valid email is required',
        },
        normalizeEmail: true,
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        },
    }
});

export const changePasswordValidation = checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Valid email is required',
        },
        normalizeEmail: true,
    },
    oldPassword: {
        notEmpty: {
            errorMessage: 'Old password is necessary',
        }
    },
    newPassword: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'New password must be at least 6 characters long',
        },
    },
});

