import { expect } from 'chai';
import UserServices from '../../services/user';
import StickyServices from '../../services/stickyNote';
import mongoose from 'mongoose';
import 'dotenv/config';

const userID = '5f1d3e12b4eb75448e5cde53';
const noteID = '5f1d3e12b4eb75448e5cde54';

beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DB_CONNECTION_STRING as string);

    const userObject = {
        _id: userID,
        userName: 'noteTester',
        email: 'noteTester@gmail.com',
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

describe('Notes operations scenarios in the database', () => {
    describe('Creating Note', () => {
        it('should create a note with the specified data and user id', async () => {
            const noteObject = {
                _id: noteID,
                userID,
                content: 'This is a test note',
                color: '#00FF00'
            };
            const nothing = await StickyServices.add(noteObject);
            expect(nothing).to.equal(undefined);
        });
        it('should count notes and get one as a return value', async () => {
            const count = await StickyServices.count(userID);
            expect(count).to.equal(1);
        });
    });
    describe('Finding Note', () => {
        it('should get a note by id', async () => {
            const note = await StickyServices.get(noteID, userID);
            expect(note).to.not.equal(null);
            expect(note).to.contain({
                content: 'This is a test note',
                color: '#00FF00'
            });
        });

        it('should fail to get a note by valid id and non-authorized valid user id', async () => {
            try {
                await StickyServices.get(noteID, '5f1d3e12b4eb75448e5cde7b');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should fail to get a note by non-existed valid id and valid user id', async () => {
            try {
                await StickyServices.get('5f1d3e12b4eb75448e5cde7b', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to get a note by non-valid id and valid user id', async () => {
            try {
                await StickyServices.get('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to get a note by valid id and non-valid user id', async () => {
            try {
                await StickyServices.get(noteID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Get All Notes', () => {
        it('should get an array of all notes for the user with length 1', async () => {
            const notes = await StickyServices.getAll(3, 1, userID);
            expect(notes).to.have.lengthOf(1);
        });

        it('should fail to get an array of all notes for the user with an invalid id', async () => {
            try {
                await StickyServices.getAll(3, 1, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Updating Note', () => {
        it('should update the note with note id and user id and get modifiedCount equal to 1', async () => {
            const modifiedCount = await StickyServices.update(
                noteID,
                { content: 'new Heading' },
                userID
            );
            expect(modifiedCount).to.equal(1);
        });

        it('should fail to update the note with non-existed valid note id and user id', async () => {
            try {
                await StickyServices.update(
                    '5f1d3e12b4eb75448e5cde7a',
                    { content: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to update the note with non-valid note id and user id', async () => {
            try {
                await StickyServices.update(
                    'Invalid',
                    { content: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the note with note id and non-valid user id', async () => {
            try {
                await StickyServices.update(
                    noteID,
                    { content: 'new Heading' },
                    'Invalid'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the note with note id and non-authorized valid user id', async () => {
            try {
                await StickyServices.update(
                    noteID,
                    { content: 'new Heading' },
                    '5f1d3e12b4eb75448e5cde7a'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });
    });

    describe('Deleting Note', () => {
        it('should fail to delete the note with non-existed valid note id and user id', async () => {
            try {
                await StickyServices.remove('5f1d3e12b4eb75448e5cde7a', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to delete the note with non-valid note id and user id', async () => {
            try {
                await StickyServices.remove('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the note with note id and non-valid user id', async () => {
            try {
                await StickyServices.remove(noteID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the note with note id and non-authorized valid user id', async () => {
            try {
                await StickyServices.remove(noteID, '5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should delete the note with note id and user id and get deleteCount equal to 1', async () => {
            const deleteCount = await StickyServices.remove(noteID, userID);
            expect(deleteCount).to.equal(1);
        });
    });
});
