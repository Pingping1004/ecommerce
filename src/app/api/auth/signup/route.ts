import { signupUser } from "@/features/auth/authService";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const body = await req.json();
        console.log("Request body:", body); // Debugging: Log the request body

        const { email, password, username, role } = body; // Ensure correct destructuring
        if (!password) throw new Error("Password is required"); // Validate password

        const token = await signupUser(email, password, username, role); // Pass arguments in correct order

        return NextResponse.json({ token }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error.message); // Debugging: Log the error
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
