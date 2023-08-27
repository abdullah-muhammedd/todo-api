import joi from 'joi';

/**
 * Validation schema for a tag.
 */
export const tagValidation = joi.object({
    /**
     * The heading of the tag.
     *
     * @type {string}
     * @required
     * @description This field is required.
     * @messages {'any.only': 'Tag Heading Is Required '}
     */
    heading: joi.string().trim().required().messages({
        'any.only': 'Tag Heading Is Required '
    }),

    /**
     * The color of the tag in hexadecimal format.
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
