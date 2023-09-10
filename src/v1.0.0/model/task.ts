import mongoose, { Schema, Document, Types, UpdateQuery } from 'mongoose';
import List from './list';
import Tag from './tag';
import ValidationError from '../utility/_error/ValidationError';
import { BAD_REQUEST } from '../utility/_types/statusCodes';
export interface ITask extends Document {
    userID: {
        type: Types.ObjectId;
        ref: string;
    };
    heading: string;
    description?: string;
    dueDate?: Date;
    listID?: {
        type: Types.ObjectId;
        ref: string;
    };
    tagID?: {
        type: Types.ObjectId;
        ref: string;
    };
    done?: boolean;
    subTasks?: [
        {
            heading?: {
                type: string;
            };
            done?: boolean;
        }
    ];
}

const taskSchema = new Schema<ITask>(
    {
        userID: {
            type: Types.ObjectId,
            ref: 'User',
            required: [true, 'UserID Is Required']
        },
        heading: {
            type: String,
            required: [true, 'Heading Is Required']
        },
        description: {
            type: String
        },
        dueDate: {
            type: Date
        },
        listID: {
            type: Types.ObjectId,
            ref: 'List'
        },
        tagID: {
            type: Types.ObjectId,
            ref: 'Tag'
        },
        done: {
            type: Boolean,
            default: false
        },
        subTasks: {
            type: [
                {
                    heading: {
                        type: String
                    },
                    done: {
                        type: Boolean
                    }
                }
            ],
            default: []
        }
    },
    { timestamps: true }
);

// Define a pre-save hook to validate the listID
taskSchema.pre('save', async function (next) {
    if (this.isModified('listID')) {
        const listExists = await List.exists({ _id: this.listID });
        if (!listExists) {
            throw new ValidationError(
                'The provided listID is not exists',
                BAD_REQUEST
            );
        }
    }
    next();
});

// Define a pre-save hook to validate the tagID
taskSchema.pre('save', async function (next) {
    if (this.isModified('tagID')) {
        const tagExists = await Tag.exists({ _id: this.tagID });
        if (!tagExists) {
            throw new ValidationError(
                'The provided tagID is not exists',
                BAD_REQUEST
            );
        }
    }
    next();
});

// Define a pre-updateOne hook to validate the listID
taskSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate() as UpdateQuery<any>;

    const listID = update?.listID as string | undefined;
    if (listID) {
        const listExists = await List.exists({ _id: listID });
        if (!listExists) {
            throw new ValidationError(
                'The provided listID is not exists',
                BAD_REQUEST
            );
        }
    }
    next();
});

// Define a pre-updateOne hook to validate the tagID
taskSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate() as UpdateQuery<any>;

    const tagID = update?.tagID as string | undefined;
    if (tagID) {
        const tagExists = await Tag.exists({ _id: tagID });
        if (!tagExists) {
            throw new ValidationError(
                'The provided tagID is not exists',
                BAD_REQUEST
            );
        }
    }
    next();
});

taskSchema.index({ listID: 1 });
taskSchema.index({ tagID: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
