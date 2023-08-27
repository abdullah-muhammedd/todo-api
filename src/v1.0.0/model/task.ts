import mongoose, { Schema, Document, Types } from 'mongoose';

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

taskSchema.index({ listID: 1, tagID: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
