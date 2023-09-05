import { expect } from 'chai';
import { listValidationSchema } from '../../utility/_validation/list';

describe('List Data Validation', () => {
    it('should validate list and get undifend as error value', () => {
        const body = {
            heading: 'Just a test heading',
            color: '#00FF00'
        };
        const { error } = listValidationSchema.validate(body);
        expect(error).to.equal(undefined);
    });
    it('should validate list data and get an error caused by heading being required', () => {
        const body = {
            color: '#00FF00'
        };
        const { error } = listValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('List Heading Is Required');
    });
    it('should validate list data and get an error caused by color being inavalid', () => {
        const body = {
            heading: 'Just a test heading',
            color: '00FF00'
        };
        const { error } = listValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'Not Valid Color, Required Hexadecimal Format'
        );
    });
});
