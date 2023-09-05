import { expect } from 'chai';
import { taskValidationSchema } from '../../utility/_validation/task';

describe('Task Data Validation', () => {
    it('should validate task and get undifend as error value', () => {
        const body = {
            heading: 'Task Heading',
            description: 'Task Description',
            dueDate: '2023-09-11',
            listID: '64f64ca87c9d7935de553adf',
            tagID: '64f64cbb7c9d7935de553ae3',
            done: false,
            subTasks: [
                { heading: 'Subtask 1 Heading', done: false },
                { heading: 'Subtask 2 Heading', done: true }
            ]
        };
        const { error } = taskValidationSchema.validate(body);
        expect(error).to.equal(undefined);
    });
    it('should validate task data and get an error caused by heading being required', () => {
        const body = {
            description: 'Task Description',
            dueDate: '2023-09-11',
            listID: '64f64ca87c9d7935de553adf',
            tagID: '64f64cbb7c9d7935de553ae3',
            done: false,
            subTasks: [
                { heading: 'Subtask 1 Heading', done: false },
                { heading: 'Subtask 2 Heading', done: true }
            ]
        };
        const { error } = taskValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Task Heading Is Required');
    });
});
