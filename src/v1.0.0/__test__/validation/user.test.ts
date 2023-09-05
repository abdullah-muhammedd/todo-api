import { expect } from 'chai';
import {
    addingUserSchema,
    checkingUserSchema
    // updatingPasswordSchema
} from '../../utility/_validation/user';

describe('User Data Validation', () => {
    it('should validate user data and get undefined as the error value', () => {
        const body = {
            userName: 'userName123new',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.equal(undefined);
    });
    it('should validate user data and get an error caused by the userName being too short', () => {
        const body = {
            userName: 'us',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'UserName Is Too Short It Must Be More Than 3 Chracters'
        );
    });
    it('should validate user data and get an error caused by the userName being too long', () => {
        const body = {
            userName: 'useruseruseruseruseruseruseruseruser',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'UserName Is Too Long It Must Be Less Than 30 Chracters'
        );
    });
    it('should validate user data and get an error caused by the userName being required', () => {
        const body = {
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('UserName Is Required');
    });
    it('should validate user data and get an error caused by the userName being required to be alphanumiric', () => {
        const body = {
            userName: 'hhh$%$',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'UserName Must Contain Only English Chracters And Numbers'
        );
    });
    it('should validate user data and get an error caused by the email being invalid', () => {
        const body = {
            userName: 'userName123',
            email: 'emailgmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Email Is Not Valid');
    });
    it('should validate user data and get an error caused by the email being reuired', () => {
        const body = {
            userName: 'userName123',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Email Is Required');
    });
    it('should validate user data and get an error caused by the password being invalid', () => {
        const body = {
            userName: 'userName123',
            email: 'email@gmail.com',
            password: 'aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal(
            'Password Must Be More than 8 Characters, And Contain 1 Uppercase, 1 Lowercase, And 1 Number'
        );
    });
    it('should validate user data and get an error caused by the password being required', () => {
        const body = {
            userName: 'userName123',
            email: 'email@gmail.com',
            confirmPassword: 'Aa12131415new',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Password Is Required');
    });
    it('should validate user data and get an error caused by the firstName being required', () => {
        const body = {
            userName: 'userName123',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('First Name Is Required');
    });
    it('should validate user data and get an error caused by the lastName being required', () => {
        const body = {
            userName: 'userName123',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415new',
            firstName: 'John'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Last Name Is Required');
    });
    it('should validate user data and get an error caused by the confirmPassword and password do not matched', () => {
        const body = {
            userName: 'userName123',
            email: 'email@gmail.com',
            password: 'Aa12131415new',
            confirmPassword: 'Aa12131415ne',
            firstName: 'John',
            lastName: 'doe'
        };
        const { error } = addingUserSchema.validate(body);
        expect(error).to.not.equal(undefined);
        expect(error?.message).to.equal('Passwords Do Not Match');
    });
    it('should validate user data on login either with email or userName and get undifend as error value', () => {
        const bodyWithEmail = {
            email: 'email@gmail.com',
            password: 'Aa12131415new'
        };
        const { error: error1 } = checkingUserSchema.validate(bodyWithEmail);
        expect(error1).to.not.equal(undefined);
        const bodyWithUserName = {
            userName: 'userName123',
            password: 'Aa12131415new'
        };
        const { error: error2 } = checkingUserSchema.validate(bodyWithUserName);
        expect(error2).to.not.equal(undefined);
    });
});
