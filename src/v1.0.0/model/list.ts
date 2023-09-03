import mongoose, { Schema, Document, Types } from 'mongoose';
import Task from './task';
export interface IList extends Document {
    userID: {
        type: Types.ObjectId;
        ref: string;
    };
    heading: string;
    color?: string;
}

const listSchema = new Schema<IList>(
    {
        userID: {
            type: Types.ObjectId,
            ref: 'User',
            required: [true, 'UserID Is Required']
        },
        heading: {
            type: String,
            required: [true, 'Tag Heading Is Required']
        },
        color: {
            type: String,
            default: '#dbdbdb'
        }
    },
    { timestamps: true }
);

// Define a pre-delete hook to set listID to null on associated tasks
listSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const listID = this.getQuery()._id;

    // Update all tasks that have this listID to set listID to null
    await Task.updateMany({ listID }, { $set: { listID: null } });

    next();
});

const List = mongoose.model<IList>('List', listSchema);

export default List;
