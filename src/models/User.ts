import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    email: string;
    password: string;
    username?: string;
    role?: 'seller' | 'buyer';
}

const UserSchema = new Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String },
        role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    },
    { timestamps: true },
);

export default mongoose.models.Users || mongoose.model<User>('Users', UserSchema);