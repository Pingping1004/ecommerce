import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/database";
import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export const signupUser = async (
    email: string,
    password: string,
    username?: string,
    role: string = "buyer"
) => {
    try {
        if (!email) throw new Error("Email is required");
        if (!password) throw new Error("Password is required");

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            role,
        });
        await newUser.save();
        console.log("Signup user: ", newUser);

        const tokenPayload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        };

        console.log("Token payload for signup:", tokenPayload);
        const token = await signToken(tokenPayload);
        console.log("Token: ", token);

        const response = NextResponse.json(
            { message: "Authentication successful" },
            { status: 200 }
        );

        return response;
    } catch (error) {
        console.error(
            "Signup error:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Signup failed");
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        await connectToDatabase();
        console.log("User model:", User);
        console.log("Login attempt with email:", email);
        const user = await User.findOne({ email });

        if (!user) {
            console.error("User not found for email:", email);
            throw new Error("User has not registered yet");
        }

        console.log("User found:", user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Plain text password:", password);
        console.log("Hashed password in DB:", user.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        console.log("Token payload for login:", tokenPayload);
        const token = await signToken(tokenPayload); // Generate token for logging/debug only
        console.log("Token: ", token);

        const response = NextResponse.json(
            { message: "Authentication successful" },
            { status: 200 }
        );

        return response;
    } catch (error) {
        console.error(
            "Login error:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Login failed");
    }
};
