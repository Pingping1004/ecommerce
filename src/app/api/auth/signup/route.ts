import { signupUser } from "@/features/auth/authService";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();
        console.log("Request body:", body); // Debugging: Log the request body

        const { email, password, username, role } = body; // Ensure correct destructuring
        if (!password) throw new Error("Password is required"); // Validate password

        const response = await signupUser(email, password, username, role); // Call signupUser without res

        return response; // Return the response from signupUser
    } catch (error: any) {
        console.error("Signup error:", error.message); // Debugging: Log the error
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
