import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import { loginUser } from "@/features/auth/authService";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { email, password } = await req.json();
        console.log("Login request body:", { email, password }); // Debugging: Log request body

        if (!password) {
            console.error("Password is missing in the request body"); // Debugging: Log missing password
            throw new Error("Password is required");
        }

        const response = await loginUser(email, password); // Call loginUser without res

        return response; // Return the response from loginUser
    } catch (error: any) {
        console.error("Login route error:", error.message); // Debugging: Log error message
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
