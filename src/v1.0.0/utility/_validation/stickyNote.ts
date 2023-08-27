import joi from 'joi';

/**
 * Validation schema for a sticky note.
 */
export const sticyNoteValidation = joi.object({
    /**
     * The content of the sticky note.
     *
     * @type {string}
     * @required
     * @description This field is required.
     * @messages {'any.only': 'Sticky Note Content Is Required '}
     */
    content: joi.string().trim().required().messages({
        'any.only': 'Sticky Note Content Is Required '
    }),

    /**
     * The color of the sticky note in hexadecimal format.
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
