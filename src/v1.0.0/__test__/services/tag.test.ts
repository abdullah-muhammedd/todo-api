import { expect } from 'chai';
import UserServices from '../../services/user';
import TagServices from '../../services/tag';
import mongoose from 'mongoose';
import 'dotenv/config';

const userID = '5f1d3e12b4eb75448e5cde55';
const tagID = '5f1d3e12b4eb75448e5cde56';

beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DB_CONNECTION_STRING as string);

    const userObject = {
        _id: userID,
        userName: 'tagTester',
        email: 'tagTester@gmail.com',
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

describe('Tags operations scenarios in the database', () => {
    describe('Creating Tag', () => {
        it('should create a tag with the specified data and user id', async () => {
            const tagObject = {
                _id: tagID,
                userID,
                heading: 'This is a test tag',
                color: '#00FF00'
            };
            const nothing = await TagServices.add(tagObject);
            expect(nothing).to.equal(undefined);
        });
    });

    describe('Finding Tag', () => {
        it('should get a tag by id', async () => {
            const tag = await TagServices.get(tagID, userID);
            expect(tag).to.not.equal(null);
            expect(tag).to.contain({
                heading: 'This is a test tag',
                color: '#00FF00'
            });
        });

        it('should fail to get a tag by valid id and non-owner valid user id', async () => {
            try {
                await TagServices.get(tagID, '5f1d3e12b4eb75448e5cde7b');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should fail to get a tag by non-existed valid id and valid user id', async () => {
            try {
                await TagServices.get('5f1d3e12b4eb75448e5cde7b', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to get a tag by non-valid id and valid user id', async () => {
            try {
                await TagServices.get('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to get a tag by valid id and non-valid user id', async () => {
            try {
                await TagServices.get(tagID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Get All Tags', () => {
        it('should get an array of all tags for the user with length 1', async () => {
            const tags = await TagServices.getAll(3, 1, userID);
            expect(tags).to.have.lengthOf(1);
        });

        it('should fail to get an array of all tags for the user with an invalid id', async () => {
            try {
                await TagServices.getAll(3, 1, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Updating Tag', () => {
        it('should update the tag with tag id and user id and get modifiedCount equal to 1', async () => {
            const modifiedCount = await TagServices.update(
                tagID,
                { heading: 'new Heading' },
                userID
            );
            expect(modifiedCount).to.equal(1);
        });

        it('should fail to update the tag with non-existed valid tag id and user id', async () => {
            try {
                await TagServices.update(
                    '5f1d3e12b4eb75448e5cde7a',
                    { heading: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to update the tag with non-valid tag id and user id', async () => {
            try {
                await TagServices.update(
                    'Invalid',
                    { heading: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the tag with tag id and non-valid user id', async () => {
            try {
                await TagServices.update(
                    tagID,
                    { heading: 'new Heading' },
                    'Invalid'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the tag with tag id and non-authorized valid user id', async () => {
            try {
                await TagServices.update(
                    tagID,
                    { heading: 'new Heading' },
                    '5f1d3e12b4eb75448e5cde7a'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });
    });
    describe('Deleting Tag', () => {
        it('should fail to delete the tag with non existed valid tag id and user id', async () => {
            try {
                await TagServices.remove('5f1d3e12b4eb75448e5cde7a', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to delete the tag with non valid tag id and user id', async () => {
            try {
                await TagServices.remove('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the tag with tag id and non valid user id', async () => {
            try {
                await TagServices.remove(tagID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the tag with tag id and non authorized valid user id', async () => {
            try {
                await TagServices.remove(tagID, '5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should delete the tag with tag id and user id and get deleteCount equal to 1', async () => {
            const deleteCount = await TagServices.remove(tagID, userID);
            expect(deleteCount).to.equal(1);
        });
    });
});
