import mongoose, { Schema, Document, Types } from 'mongoose';
import Task from './task';
export interface ITag extends Document {
    userID: {
        type: Types.ObjectId;
        ref: string;
    };
    heading: string;
    color?: string;
}

const tagSchema = new Schema<ITag>(
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

// Define a pre-delete hook to set tagID to null on associated tasks
tagSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const tagID = this.getQuery()._id;

    // Update all tasks that have this listID to set listID to null
    await Task.updateMany({ tagID }, { $set: { tagID: null } });

    next();
});
const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
