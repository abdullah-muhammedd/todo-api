import joi from 'joi';
// Seperate and reusable attributes validation rules
const userNameSchema = joi
    .string()
    .trim()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
        'string.min': 'UserName Is Too Short It Must Be More Than 3 Chracters',
        'string.max': 'UserName Is Too Long It Must Be Less Than 30 Chracters',
        'any.required': 'UserName Is Required',
        'string.alphanum':
            'UserName Must Contain Only English Chracters And Numbers'
    });

const emailSchema = joi
    .string()
    .trim()
    .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    })
    .required()
    .messages({
        'string.email': 'Email Is Not Valid',
        'any.required': 'Email Is Required'
    });

const passwordSchema = joi
    .string()
    .trim()
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .required()
    .messages({
        'string.pattern.base':
            'Password Must Be More than 8 Characters, And Contain 1 Uppercase, 1 Lowercase, And 1 Number',
        'any.required': 'Password Is Required'
    });

const firstNameSchema = joi.string().trim().required().messages({
    'any.required': 'First Name Is Required'
});

const lastNameSchema = joi.string().trim().required().messages({
    'any.required': 'Last Name Is Required'
});

/**
 * Validation schema for a user's attributes.
 * @property {string} userName - The username.
 * @property {string} email - The email address.
 * @property {string} password - The password.
 * @property {string} confirmPassword - The password confirmation.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 */

export const addingUserSchema = joi
    .object({
        userName: userNameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: joi
            .string()
            .trim()
            .valid(joi.ref('password'))
            .messages({
                'any.only': 'Passwords Do Not Match'
            }),
        firstName: firstNameSchema,
        lastName: lastNameSchema
    })
    .with('password', 'confirmPassword');

export const updatingUserSchema = joi.object({
    userName: userNameSchema,
    email: emailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema
});

/**
 * Validation schema for checking a user's credentials during login.
 * @typedef {Object} UserLoginSchema
 * @property {string} emailOrUserName - The email address or username.
 * @property {string} password - The user's password.
 */
export const checkingUserSchema = joi.object({
    emailOrUserName: joi.alternatives(
        joi
            .string()
            .trim()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] }
            })
            .required()
            .messages({
                'string.email': 'Email Is Not Valid',
                'any.required': 'Email Is Required'
            }),
        joi.string().trim().alphanum().min(3).max(30).required().messages({
            'string.min': 'UserName Is Not Valid',
            'string.max': 'UserName Is Not Valid',
            'any.required': 'UserName Is Required',
            'string.alphanum': 'UserName Is Not Valid'
        })
    ),
    password: joi.string().trim().required()
});

/**
 * Validation schema for updating a user's password.
 * @typedef {Object} UserPasswordSchema
 * @property {string} password - The new password.
 */
export const updatingPasswordSchema = joi.object({
    password: passwordSchema
});
