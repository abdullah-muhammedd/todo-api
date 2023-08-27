import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITag extends Document {
    userID: {
        type: Types.ObjectId;
        ref: string;
    };
    heading: string;
    color: string;
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
            required: [true, 'Tag Heading Is Required'],
            unique: true
        },
        color: {
            type: String,
            default: '#dbdbdb'
        }
    },
    { timestamps: true }
);
tagSchema.pre('deleteOne', () => {});
const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
