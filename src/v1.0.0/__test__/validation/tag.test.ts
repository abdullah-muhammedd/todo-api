import { expect } from 'chai';
import { tagValidationSchema } from '../../utility/_validation/tag';

describe('Tag Data Validation', () => {
    it('should validate tag and get undifend as error value', () => {
        const body = {
            heading: 'Just a test heading',
            color: '#00FF00'
        };
        const { error } = tagValidationSchema.validate(body);
        expect(error).to.equal(undefined);
    });
    it('should validate tag data and get an error caused by heading being required', () => {
        const body = {
            color: '#00FF00'
        };
        const { error } = tagValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Tag Heading Is Required');
    });
    it('should validate tag data and get an error caused by color being inavalid', () => {
        const body = {
            heading: 'Just a test heading',
            color: '00FF00'
        };
        const { error } = tagValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'Not Valid Color, Required Hexadecimal Format'
        );
    });
});
