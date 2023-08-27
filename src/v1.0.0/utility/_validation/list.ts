import joi from 'joi';

/**
 * Validation schema for a list.
 */
export const listValidation = joi.object({
    /**
     * The heading of the list.
     *
     * @type {string}
     * @required
     * @description This field is required.
     * @messages {'any.only': 'List Heading Is Required '}
     */
    heading: joi.string().trim().required().messages({
        'any.only': 'List Heading Is Required '
    }),

    /**
     * The color of the list in hexadecimal format.
     *
     * @type {string}
     * @hex
     * @description The color should be in hexadecimal format.
     * @messages {'string.hex': 'Not Valid Color, Required Hexadecimal Format', 'string.hexAlign': 'Not Valid Color, Required Hexadecimal Format'}
     */
    color: joi.string().trim().hex().messages({
        'string.hex': 'Not Valid Color, Required Hexadecimal Format',
        'string.hexAlign': 'Not Valid Color, Required Hexadecimal Format'
    })
});
