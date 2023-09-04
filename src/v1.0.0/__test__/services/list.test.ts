import { expect } from 'chai';
import UserServices from '../../services/user';
import ListServices from '../../services/list';
import mongoose from 'mongoose';
import 'dotenv/config';

const userID = '5f1d3e12b4eb75448e5cde50';
const listID = '5f1d3e12b4eb75448e5cde51';

beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DB_CONNECTION_STRING as string);

    const userObject = {
        _id: userID,
        userName: 'listTester',
        email: 'listTester@gmail.com',
        password: 'Aa12131415',
        confirmPassword: 'Aa12131415',
        firstName: 'John',
        lastName: 'Doe'
    };
    await UserServices.add(userObject);
});

afterAll(async () => {
    await UserServices.remove(userID);
    await mongoose.connection.close();
});

describe('Lists operations scenarios in the database', () => {
    describe('Creating List', () => {
        it('should create a list with the specified data and user id', async () => {
            const listObject = {
                _id: listID,
                userID,
                heading: 'This is a test list',
                color: '#00FF00'
            };
            const nothing = await ListServices.add(listObject);
            expect(nothing).to.equal(undefined);
        });
    });

    describe('Finding List', () => {
        it('should get a list by id', async () => {
            const list = await ListServices.get(listID, userID);
            expect(list).to.not.equal(null);
            expect(list).to.contain({
                heading: 'This is a test list',
                color: '#00FF00'
            });
        });

        it('should fail to get a list by valid id and non-owner valid user id', async () => {
            try {
                await ListServices.get(listID, '5f1d3e12b4eb75448e5cde7b');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should fail to get a list by non-existed valid id and valid user id', async () => {
            try {
                await ListServices.get('5f1d3e12b4eb75448e5cde7b', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to get a list by non-valid id and valid user id', async () => {
            try {
                await ListServices.get('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to get a list by valid id and non-valid user id', async () => {
            try {
                await ListServices.get(listID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Get All Lists', () => {
        it('should get an array of all tasks for the user with length 1', async () => {
            const lists = await ListServices.getAll(3, 1, userID);
            expect(lists).to.have.lengthOf(1);
        });

        it('should fail to get an array of all tasks for the user with an invalid id', async () => {
            try {
                await ListServices.getAll(3, 1, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Updating lists', () => {
        it('should update the list with list id and user id and get modifiedCount equal to 1', async () => {
            const modifiedCount = await ListServices.update(
                listID,
                { heading: 'new Heading' },
                userID
            );
            expect(modifiedCount).to.equal(1);
        });

        it('should fail to update the list with non-existed valid list id and user id', async () => {
            try {
                await ListServices.update(
                    '5f1d3e12b4eb75448e5cde7a',
                    { heading: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to update the list with a non-valid list id and user id', async () => {
            try {
                await ListServices.update(
                    'Invalid',
                    { heading: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the list with list id and non-valid user id', async () => {
            try {
                await ListServices.update(
                    listID,
                    { heading: 'new Heading' },
                    'Invalid'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the list with list id and non-authorized valid user id', async () => {
            try {
                await ListServices.update(
                    listID,
                    { heading: 'new Heading' },
                    '5f1d3e12b4eb75448e5cde7a'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });
    });

    describe('Deleting List', () => {
        it('should fail to delete the list with non-existed valid list id and user id', async () => {
            try {
                await ListServices.remove('5f1d3e12b4eb75448e5cde7a', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to delete the list with a non-valid list id and user id', async () => {
            try {
                await ListServices.remove('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the list with list id and non-valid user id', async () => {
            try {
                await ListServices.remove(listID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the list with list id and non-authorized valid user id', async () => {
            try {
                await ListServices.remove(listID, '5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should delete the list with list id and user id and get deleteCount equal to 1', async () => {
            const deleteCount = await ListServices.remove(listID, userID);
            expect(deleteCount).to.equal(1);
        });
    });
});
