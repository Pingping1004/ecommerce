import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
    email: string;
    password: string;
    role?: "seller" | "buyer";
    username?: string;
    createdAt: Date;
}

const UserSchema = new Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
        username: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true, collection: "Users" }
);

// Pre-save hook to hash password
UserSchema.pre<User>("save", async function (next) {
    if (this.isModified("password")) {
        console.log("Hashing password before saving"); // Debugging: Log password hashing
        this.password = await bcrypt.hash(this.password, 12);
        console.log("Hashed password:", this.password); // Debugging: Log hashed password
    }
    next();
});

// Pre-save hook to derive username from email
UserSchema.pre<User>("save", async function (next) {
    console.log("Pre-save hook triggered");

    if (!this.username && this.email) {
        // Extract the part of the email before the '@' symbol
        this.username = this.email.split("@")[0];
        console.log("Derived username from email:", this.username); // Debugging: Log the derived username
    } else {
        console.log("Username already set or email missing:", this.username); // Debugging: Log if username is already set
    }

    next();
});

export default mongoose.models.User ||
    mongoose.model<User>("User", UserSchema, "Users");
