import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    email: string;
    password?: string; // Make password optional
    role?: "seller" | "buyer";
    username?: string;
    createdAt: Date;
}

const UserSchema = new Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false }, // Explicitly mark as not required
        role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
        username: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true, collection: "Users" }
);

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
