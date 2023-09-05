import Joi from 'joi';
export const taskValidationSchema = Joi.object({
    /**
     * The heading of the task.
     *
     * @type {string}
     * @required
     * @description This field is required.
     * @messages {'any.required': 'Task Heading Is Required'}
     */
    heading: Joi.string().trim().required().messages({
        'any.required': 'Task Heading Is Required'
    }),

    /**
     * The description of the task.
     *
     * @type {string}
     * @description This field is optional.
     */
    description: Joi.string().trim(),

    /**
     * The due date of the task.
     *
     * @type {Date}
     * @description This field is optional.
     */
    dueDate: Joi.date(),

    /**
     * The list ID associated with the task.
     *
     * @type {string}
     * @description This field is optional.
     */
    listID: Joi.string().trim(),

    /**
     * The tag ID associated with the task.
     *
     * @type {string}
     * @description This field is optional.
     */
    tagID: Joi.string().trim(),

    /**
     * Indicates whether the task is done or not.
     *
     * @type {boolean}
     * @description This field is optional.
     */
    done: Joi.boolean(),

    /**
     * An array of subtasks associated with the task.
     *
     * @type {Array}
     * @description This field is optional and can contain objects with 'heading' and 'done' fields.
     */
    subTasks: Joi.array().items(
        Joi.object({
            /**
             * The heading of the subtask.
             *
             * @type {string}
             * @description This field is optional.
             */
            heading: Joi.string().trim(),

            /**
             * Indicates whether the subtask is done or not.
             *
             * @type {boolean}
             * @description This field is optional.
             */
            done: Joi.boolean()
        })
    )
});
