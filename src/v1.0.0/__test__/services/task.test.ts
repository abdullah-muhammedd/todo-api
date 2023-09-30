import UserServices from '../../services/user';
import TaskServices from '../../services/task';
import ListServices from '../../services/list';
import TagServices from '../../services/tag';
import mongoose from 'mongoose';
import { expect } from 'chai';

const userID = '5f1d3e12b4eb75448e5cde60';
const listID = '5f1d3e12b4eb75448e5cde61';
const tagID = '5f1d3e12b4eb75448e5cde62';
const task1ID = '5f1d3e12b4eb75448e5cde63';
const task2ID = '5f1d3e12b4eb75448e5cde64';
const task3ID = '5f1d3e12b4eb75448e5cde65';
beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DB_CONNECTION_STRING as string);

    const userObject = {
        _id: userID,
        userName: 'taskTrster',
        email: 'taskTrster@gmail.com',
        password: 'Aa12131415',
        confirmPassword: 'Aa12131415',
        firstName: 'John',
        lastName: 'Doe'
    };

    const tagObject = {
        _id: tagID,
        userID,
        heading: 'This is a test tag',
        color: '#00FF00'
    };

    const listObject = {
        _id: listID,
        userID,
        heading: 'This is a test list',
        color: '#00FF00'
    };
    await Promise.all([
        ListServices.add(listObject),
        UserServices.add(userObject),
        TagServices.add(tagObject)
    ]);
});

afterAll(async () => {
    await UserServices.remove(userID);
    await mongoose.connection.close();
});

describe('Tasks operations scenarios in the database', () => {
    describe('Creating Task', () => {
        it('should create a task with only heading and user id', async () => {
            const taskObject = {
                _id: task1ID,
                userID,
                heading: 'Task Heading 1'
            };
            const nothing = await TaskServices.add(taskObject);
            expect(nothing).to.equal(undefined);
        });

        it('should create a task full task data except list and tag ids and user id', async () => {
            const taskObject = {
                _id: task2ID,
                userID,
                heading: 'Task Heading 2',
                description: 'Task Description',
                dueDate: '2023-09-10',
                subTasks: [
                    {
                        heading: 'Subtask 1 Heading',
                        done: false
                    },
                    {
                        heading: 'Subtask 2 Heading',
                        done: true
                    }
                ]
            };
            const nothing = await TaskServices.add(taskObject);
            expect(nothing).to.equal(undefined);
        });

        it('should create a task with full task data and user id', async () => {
            const taskObject = {
                _id: task3ID,
                userID,
                listID,
                tagID,
                heading: 'Task Heading 3',
                description: 'Task Description',
                dueDate: '2023-09-10',
                subTasks: [
                    {
                        heading: 'Subtask 1 Heading',
                        done: false
                    },
                    {
                        heading: 'Subtask 2 Heading',
                        done: true
                    }
                ]
            };
            const nothing = await TaskServices.add(taskObject);
            expect(nothing).to.equal(undefined);
        });

        it('should fail to create a task with full task data contains non existed listID and user id', async () => {
            try {
                const taskObject = {
                    _id: task3ID,
                    userID,
                    listID: '5f1d3e12b4eb75448e5cde6a',
                    tagID,
                    heading: 'Task Heading 3',
                    description: 'Task Description',
                    dueDate: '2023-09-10',
                    subTasks: [
                        {
                            heading: 'Subtask 1 Heading',
                            done: false
                        },
                        {
                            heading: 'Subtask 2 Heading',
                            done: true
                        }
                    ]
                };
                await TaskServices.add(taskObject);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal(
                    'The provided listID is not exists'
                );
            }
        });
        it('should fail to create a task with full task data contains non existed tagID and user id', async () => {
            try {
                const taskObject = {
                    _id: task3ID,
                    userID,
                    listID,
                    tagID: '5f1d3e12b4eb75448e5cde6a',
                    heading: 'Task Heading 3',
                    description: 'Task Description',
                    dueDate: '2023-09-10',
                    subTasks: [
                        {
                            heading: 'Subtask 1 Heading',
                            done: false
                        },
                        {
                            heading: 'Subtask 2 Heading',
                            done: true
                        }
                    ]
                };
                await TaskServices.add(taskObject);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal(
                    'The provided tagID is not exists'
                );
            }
        });

        it('should count tasks and get 3 as a return value', async () => {
            const count = await TaskServices.count(userID);
            expect(count).to.equal(3);
        });
    });

    describe('Finding Task', () => {
        it('should get task by id and user id', async () => {
            const task = await TaskServices.get(task1ID, userID);
            expect(task).to.not.equal(null);
            expect(task).to.contain({ heading: 'Task Heading 1', done: false });
        });
        it('should fail to get a task by valid id and non-owner valid user id', async () => {
            try {
                await TaskServices.get(task1ID, '5f1d3e12b4eb75448e5cde7b');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });
        it('should fail to get a task by non-existed valid id and valid user id', async () => {
            try {
                await TaskServices.get('5f1d3e12b4eb75448e5cde7b', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });
        it('should fail to get a task by non-valid id and valid user id', async () => {
            try {
                await TaskServices.get('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to get a task by valid id and non-valid user id', async () => {
            try {
                await TaskServices.get(task1ID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Getting All Tasks', () => {
        it('should get an array of all tasks for the user with length 2', async () => {
            const queryParams: any = {
                done: 'false',
                dueDateFrom: '2023-09-10',
                dueDateTo: '2023-09-17',
                userID
            };
            const tasks = await TaskServices.getAll(10, 1, queryParams);
            expect(tasks).to.have.lengthOf(2);
        });
        it('should get an array of all tasks for the user with only dueDateFrom Specified', async () => {
            const queryParams: any = {
                done: 'false',
                dueDateFrom: '2023-09-10',
                dueDateTo: null,
                userID
            };
            const tasks = await TaskServices.getAll(10, 1, queryParams);
            expect(tasks).to.have.lengthOf(2);
        });
        it('should get an array of all tasks for the user with only dueDateTo Specified', async () => {
            const queryParams: any = {
                done: 'false',
                dueDateFrom: null,
                dueDateTo: '2023-09-17',
                userID
            };
            const tasks = await TaskServices.getAll(10, 1, queryParams);
            expect(tasks).to.have.lengthOf(2);
        });
        it('should fail to get an array of all tasks for the user with an invalid id', async () => {
            try {
                const queryParams: any = {
                    done: 'false',
                    dueDateFrom: '2023-09-10',
                    dueDateTo: '2023-09-17',
                    userID: 'Invaild'
                };
                await TaskServices.getAll(10, 1, queryParams);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Getting All Tasks By List', () => {
        it('should get array of tasks with listID that contain one task with task3ID and with tag and list ids populated', async () => {
            const tasks = await TaskServices.getAllByList(
                10,
                1,
                userID,
                listID
            );
            expect(tasks).to.has.lengthOf(1);
            expect(tasks[0].listID).to.contain({
                heading: 'This is a test list'
            });
        });
        it('should fail to get an array of tasks with listID for the user with an invalid id', async () => {
            try {
                await TaskServices.getAllByList(10, 1, listID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
        it('should fail to get an array of tasks with an invalid id listID', async () => {
            try {
                await TaskServices.getAllByList(10, 1, 'Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Deleting Lists Consequences', () => {
        it('should get task.listID is null after deleting the list', async () => {
            const deletedCount = await ListServices.remove(listID, userID);
            expect(deletedCount).to.equal(1);
            const task: any = await TaskServices.get(task3ID, userID);
            expect(task?.listID).to.equal(null);
        });
    });

    describe('Getting All Tasks By Tag', () => {
        it('should get array of tasks with listID that contain one task with task3ID and with tag and list ids populated', async () => {
            const tasks = await TaskServices.getAllByTag(10, 1, userID, tagID);
            expect(tasks).to.has.lengthOf(1);
            expect(tasks[0].tagID).to.contain({
                heading: 'This is a test tag'
            });
        });
        it('should fail to get an array of tasks with listID for the user with an invalid id', async () => {
            try {
                await TaskServices.getAllByTag(10, 1, 'Invalid', tagID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
        it('should fail to get an array of tasks with an invalid id listID', async () => {
            try {
                await TaskServices.getAllByTag(10, 1, userID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });
    });

    describe('Deleting Tags Consequences', () => {
        it('should get task.listID is null after deleting the list', async () => {
            const deletedCount = await TagServices.remove(tagID, userID);
            expect(deletedCount).to.equal(1);
            const task: any = await TaskServices.get(task3ID, userID);
            expect(task?.tagID).to.equal(null);
        });
    });

    describe('Toggle Task Done Status', () => {
        it('should fail to done the task with non-existed valid task id and user id', async () => {
            try {
                await TaskServices.changeDoneStatus(
                    '5f1d3e12b4eb75448e5cde7a',
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to done the task with non-valid task id and user id', async () => {
            try {
                await TaskServices.changeDoneStatus('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to done the task with task id and non-valid user id', async () => {
            try {
                await TaskServices.changeDoneStatus(task1ID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to done the task with task id and non-authorized valid user id', async () => {
            try {
                await TaskServices.changeDoneStatus(
                    task1ID,
                    '5f1d3e12b4eb75448e5cde7a'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should done the task with task id and user id and get deleteCount equal to 1', async () => {
            const modifiedCount1 = await TaskServices.changeDoneStatus(
                task1ID,
                userID
            );
            expect(modifiedCount1).to.equal(1);
            const modifiedCount2 = await TaskServices.changeDoneStatus(
                task1ID,
                userID
            );
            expect(modifiedCount2).to.equal(1);
        });
    });

    describe('Updating Task', () => {
        it('should update the task with task id and user id and get modifiedCount equal to 1', async () => {
            const modifiedCount = await TaskServices.update(
                task1ID,
                { heading: 'new Heading' },
                userID
            );
            expect(modifiedCount).to.equal(1);
        });

        it('should fail to update the task with non-existed valid task id and user id', async () => {
            try {
                await TaskServices.update(
                    '5f1d3e12b4eb75448e5cde7a',
                    {
                        heading: 'new Heading',
                        subTasks: [
                            {
                                heading: 'Subtask 1 Heading',
                                done: false
                            },
                            {
                                heading: 'Subtask 2 Heading',
                                done: true
                            }
                        ]
                    },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to update the task with non-valid task id and user id', async () => {
            try {
                await TaskServices.update(
                    'Invalid',
                    { heading: 'new Heading' },
                    userID
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the task with task id and non-valid user id', async () => {
            try {
                await TaskServices.update(
                    task1ID,
                    { heading: 'new Heading' },
                    'Invalid'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to update the task with task id and non-authorized valid user id', async () => {
            try {
                await TaskServices.update(
                    task1ID,
                    { heading: 'new Heading' },
                    '5f1d3e12b4eb75448e5cde7a'
                );
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });
    });

    describe('Deleting Task', () => {
        it('should fail to delete the task with non-existed valid task id and user id', async () => {
            try {
                await TaskServices.remove('5f1d3e12b4eb75448e5cde7a', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Entity Not Found');
            }
        });

        it('should fail to delete the task with non-valid task id and user id', async () => {
            try {
                await TaskServices.remove('Invalid', userID);
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the task with task id and non-valid user id', async () => {
            try {
                await TaskServices.remove(task1ID, 'Invalid');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid ID');
            }
        });

        it('should fail to delete the task with task id and non-authorized valid user id', async () => {
            try {
                await TaskServices.remove(task1ID, '5f1d3e12b4eb75448e5cde7a');
                expect.fail('Expected an error but did not get one.');
            } catch (error: any) {
                expect(error.message).to.equal('Access Denied');
            }
        });

        it('should delete the tsak with task id and user id and get deleteCount equal to 1', async () => {
            const [deleteCount1, deleteCount2, deleteCount3] =
                await Promise.all([
                    TaskServices.remove(task1ID, userID),
                    TaskServices.remove(task2ID, userID),
                    TaskServices.remove(task3ID, userID)
                ]);
            expect(deleteCount1).to.equal(1);
            expect(deleteCount2).to.equal(1);
            expect(deleteCount3).to.equal(1);
        });
    });
});
