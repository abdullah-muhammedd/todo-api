import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStickyNote extends Document {
    userID: {
        type: Types.ObjectId;
        ref: string;
    };
    content: string;
    color?: string;
}

const stickyNoteSchema = new Schema<IStickyNote>(
    {
        userID: {
            type: Types.ObjectId,
            ref: 'User',
            required: [true, 'UserID Is Required']
        },
        content: {
            type: String,
            required: [true, 'Sticky Note Heading Is Required']
        },
        color: {
            type: String,
            default: '#dbdbdb'
        }
    },
    { timestamps: true }
);

const StickyNote = mongoose.model<IStickyNote>('Tag', stickyNoteSchema);

export default StickyNote;
