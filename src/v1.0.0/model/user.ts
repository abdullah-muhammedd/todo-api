import mongoose, { Schema, Document } from 'mongoose';
import 'dotenv/config';

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
                    const regex: RegExp = new RegExp(process.env.MAIL_VALIDATION_REGEX as string);
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
const User = mongoose.model<IUser>('User', userSchema);

export default User;
