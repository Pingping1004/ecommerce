import mongoose, { Schema, Document } from "mongoose";

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

export default mongoose.models?.["User"] ||
    mongoose.model<UserType>("User", UserSchema, "Users");
