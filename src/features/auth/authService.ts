import bcrypt from "bcryptjs";
import User from "../../models/User";
import { signToken } from "@/lib/jwt";

export const signupUser = async (
    email: string,
    password: string,
    username?: string,
    role: string = "buyer" // Default role to "buyer"
) => {
    try {
        if (!email) throw new Error("Email is required"); // Validate email
        if (!password) throw new Error("Password is required"); // Validate password

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
        const tokenPayload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        };

        console.log("Token payload for signup:", tokenPayload); // Debugging: Log token payload
        return signToken(JSON.stringify(tokenPayload)); // Pass plain object
    } catch (error) {
        if (error instanceof Error) {
            console.error("Signup error:", error.message);
        } else {
            console.error("Signup error:", error);
        }
        throw new Error("Signup failed");
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        console.log("Login attempt with email:", email); // Debugging: Log email being queried
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email); // Debugging: Log if user is not found
            throw new Error("User has not registered yet");
        }

        console.log("User found:", user); // Debugging: Log user data (excluding sensitive info)
        console.log("Hashed password in DB:", user.password); // Debugging: Log hashed password
        console.log("Plain text password:", password); // Debugging: Log plain text password

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch); // Debugging: Log password comparison result

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        console.log("Token payload for login:", tokenPayload); // Debugging: Log token payload
        return signToken(JSON.stringify(tokenPayload)); // Pass plain object
    } catch (error) {
        if (error instanceof Error) {
            console.error("Login error:", error.message); // Debugging: Log error message
        } else {
            console.error("Login error:", error); // Handle non-Error types
        }
        throw error;
    }
};
