import mongoose, { Schema, Document, Types } from 'mongoose';

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

// listSchema.pre('deleteOne', () => {});
const List = mongoose.model<IList>('List', listSchema);

export default List;
