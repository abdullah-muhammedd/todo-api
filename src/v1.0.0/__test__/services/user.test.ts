import { expect } from 'chai';
import UserServices from '../../services/user';
import mongoose from 'mongoose';
import 'dotenv/config';

const userID = '5f1d3e12b4eb75448e5cde74';

beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DB_CONNECTION_STRING as string);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User operations scenarios in the database', () => {
    describe('Creating and Finding Users', () => {
        it('should successfully create a new user and return nothing', async () => {
            const userObject = {
                _id: userID,
                userName: 'userName123',
                email: 'email@gmail.com',
                password: 'Aa12131415',
                confirmPassword: 'Aa12131415',
                firstName: 'John',
                lastName: 'Doe'
            };
            const nothing = await UserServices.add(userObject);
            expect(nothing).to.equal(undefined);
        });
        it('should failt to create with ivalid email', async () => {
            try {
                const userObject = {
                    _id: userID,
                    userName: 'userName123',
                    email: 'emailgmail.com',
                    password: 'Aa12131415',
                    confirmPassword: 'Aa12131415',
                    firstName: 'John',
                    lastName: 'Doe'
                };
                await UserServices.add(userObject);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal(
                    'User validation failed: email: Email Is Not Valid'
                );
            }
        });

        it('should fail to create a new user with the same username and throw a unique index error on username', async () => {
            const userObject = {
                userName: 'userName123',
                email: 'another.email@gmail.com',
                password: 'Aa12131415',
                confirmPassword: 'Aa12131415',
                firstName: 'John',
                lastName: 'Doe'
            };
            try {
                await UserServices.add(userObject);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.code).to.equal(11000);
                expect(error.keyPattern).to.contain({ userName: 1 });
            }
        });

        it('should fail to create a new user with the same email and throw a unique index error on email', async () => {
            const userObject = {
                userName: 'anotheruserName123',
                email: 'email@gmail.com',
                password: 'Aa12131415',
                confirmPassword: 'Aa12131415',
                firstName: 'John',
                lastName: 'Doe'
            };
            try {
                await UserServices.add(userObject);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.code).to.equal(11000);
                expect(error.keyPattern).to.contain({ email: 1 });
            }
        });

        it('should find a user by id', async () => {
            const user = await UserServices.find(userID);
            expect(user).to.not.equal(null);
            expect(user).to.contain({
                userName: 'userName123',
                email: 'email@gmail.com'
            });
            expect(user).to.not.contain(['password']);
        });

        it('should fail to find a user by non existed valid id', async () => {
            try {
                await UserServices.find('5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to find a user by non valid id', async () => {
            try {
                await UserServices.find('invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should find a user by username', async () => {
            const user = await UserServices.findWithUserName('userName123');
            expect(user).to.not.equal(null);
            expect(user).to.contain({
                userName: 'userName123',
                email: 'email@gmail.com'
            });
            expect(user).to.not.contain(['password']);
        });

        it('should fail to find a user by non existed username', async () => {
            try {
                await UserServices.findWithUserName('userName1234');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should find a user by email', async () => {
            const user = await UserServices.findWithEmail('email@gmail.com');
            expect(user).to.not.equal(null);
            expect(user).to.contain({
                userName: 'userName123',
                email: 'email@gmail.com'
            });
            expect(user).to.not.contain(['password']);
        });

        it('should fail to find a user by non existed email', async () => {
            try {
                await UserServices.findWithEmail('emailNew@gmail.com');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });
    });

    describe('Updating Users', () => {
        it('should update the user and get 1 as modifiedCount', async () => {
            const modifiedCount = await UserServices.update(userID, {
                lastName: 'test'
            });
            expect(modifiedCount).to.equal(1);
        });

        it('should fail to update the user with non existed valid id', async () => {
            try {
                await UserServices.update('5f1d3e12b4eb75448e5cde7a', {
                    lastName: 'test'
                });
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Updated');
            }
        });

        it('should fail to update the user with non valid id', async () => {
            try {
                await UserServices.update('invalid', { lastName: 'test' });
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Deleting Users', () => {
        it('should delete the user and get 1 as deletedCount', async () => {
            const deletedCount = await UserServices.remove(userID);
            expect(deletedCount).to.equal(1);
        });

        it('should fail to delete the user with non existed valid id', async () => {
            try {
                await UserServices.remove('5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Deleted');
            }
        });

        it('should fail to delete the user with non valid id', async () => {
            try {
                await UserServices.remove('invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });
});
