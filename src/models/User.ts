import mongoose, { Schema, Document } from "mongoose";
import Product from "./Product";
import Seller from "./Seller";

export interface UserType extends Document {
    email: string;
    password?: string; // Make password optional
    role?: "seller" | "buyer";
    username?: string;
    image?: string;
    createdAt: Date;
}

const UserSchema = new Schema<UserType>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false }, // Explicitly mark as not required
        role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
        username: { type: String },
        createdAt: { type: Date, default: Date.now },
        image: { type: String },
    },
    { timestamps: true, collection: "Users" }
);

// Pre-save hook to derive username from email
UserSchema.pre<UserType>("save", async function (next) {
    console.log("Pre-save hook triggered");

    if (!this.username && this.email) {
        this.username = this.email.split("@")[0];
    }
    
    next();
});

UserSchema.pre<UserType>('deleteOne',  { document: true, query: false }, async function (next) {
    try {
        await Product.deleteMany({ ownerId: this._id });
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.pre<UserType>('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await Seller.deleteOne({ userId: this._id });
        next();
    } catch (error: any) {
        next(error);
    }
});

export default mongoose.models?.["User"] ||
    mongoose.model<UserType>("User", UserSchema, "Users");
