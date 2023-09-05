import { expect } from 'chai';
import { sticyNoteValidationSchema } from '../../utility/_validation/stickyNote';

describe('Stick Note Data Validation', () => {
    it('should validate note and get undifend as error value', () => {
        const body = {
            content: 'Just a test content',
            color: '#00FF00'
        };
        const { error } = sticyNoteValidationSchema.validate(body);
        expect(error).to.equal(undefined);
    });
    it('should validate list data and get an error caused by content being required', () => {
        const body = {
            color: '#00FF00'
        };
        const { error } = sticyNoteValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Sticky Note Content Is Required');
    });
    it('should validate note data and get an error caused by color being inavalid', () => {
        const body = {
            content: 'Just a test content',
            color: '00FF00'
        };
        const { error } = sticyNoteValidationSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'Not Valid Color, Required Hexadecimal Format'
        );
    });
});
