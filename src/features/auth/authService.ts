import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/database";
import { signToken } from "@/lib/jwt";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

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

        const hashedPassword = await bcrypt.hash(password, 12); // Hash password here
        const newUser = new User({
            email,
            password: hashedPassword, // Save hashed password
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

        console.log("Token payload for signup:", tokenPayload); // Debugging: Log token payload
        const token = signToken(tokenPayload); // Pass plain object
        console.log("Token: ", token);

        const response = NextResponse.json(
            { message: "Authentication successful" },
            { status: 200 }
        );
        serializeCookie(response, await token); // Set the cookie on the response

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
        await connectToDatabase(); // Ensure database connection
        console.log("User model:", User); // Debugging: Log the User model

        console.log("Login attempt with email:", email); // Debugging: Log email being queried
        const user = await User.findOne({ email });

        if (!user) {
            console.error("User not found for email:", email); // Debugging: Log if user is not found
            throw new Error("User has not registered yet");
        }

        console.log("User found:", user); // Debugging: Log user data (excluding sensitive info)

        const isMatch = await bcrypt.compare(password, user.password); // Compare plain text password with hashed password
        console.log("Plain text password:", password); // Debugging: Log plain text password
        console.log("Hashed password in DB:", user.password); // Debugging: Log hashed password
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
        const token = signToken(tokenPayload);
        console.log("Token: ", token);

        const response = NextResponse.json(
            { message: "Authentication successful" },
            { status: 200 }
        );
        serializeCookie(response, await token); // Set the cookie on the response

        return response;
    } catch (error) {
        console.error(
            "Login error:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Login failed");
    }
};

export function serializeCookie(res: NextResponse, token: string) {
    const cookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    res.headers.append("Set-Cookie", cookie); // Use append to set the cookie
    console.log("Setting cookie: ", cookie);
}

export const logoutUser = async () => {
    try {
        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );

        // Clear the token cookie
        const cookie = serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Set the cookie to expire immediately
        });

        response.headers.append("Set-Cookie", cookie); // Use append to clear the cookie
        console.log("Clearing cookie: ", cookie);

        return response;
    } catch (error) {
        console.error(
            "Logout error:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Logout failed");
    }
};
