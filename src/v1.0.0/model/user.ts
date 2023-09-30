import mongoose, { Schema, Document } from 'mongoose';
import 'dotenv/config';
import Task from './task';
import Tag from './tag';
import List from './list';
import StickyNote from './stickyNote';
export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    refreshToken?: string;
}

const userSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: [true, 'UserName Is Required'],
            unique: true
        },
        email: {
            type: String,
            validate: {
                validator: function (value: string): boolean | never {
                    const regex: RegExp =
                        /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z]{2,})+$/;
                    if (!regex.test(value)) {
                        throw new Error('Email Is Not Valid');
                    }
                    return true;
                }
            },
            required: [true, 'Email Is Required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password Is Required']
        },
        firstName: {
            type: String,
            required: [true, 'First Name Is Required']
        },
        lastName: {
            type: String,
            required: [true, 'Last Name Is Required']
        }
    },
    { timestamps: true }
);
// Define a pre-deleteOne hook to delete user associated entites
userSchema.pre('deleteOne', async function (next) {
    const user = this as any;

    await Task.deleteMany({ userID: user._conditions._id });

    await List.deleteMany({ userID: user._conditions._id });

    await Tag.deleteMany({ userID: user._conditions._id });

    await StickyNote.deleteMany({ userID: user._conditions._id });

    next();
});
const User = mongoose.model<IUser>('User', userSchema);

export default User;
