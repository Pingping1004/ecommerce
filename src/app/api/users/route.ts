import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/models/User";

// Get all users
export async function GET() {
    await connectToDatabase();
    const users = await User.find({});
    return NextResponse.json({ message: "List of all users", users });
}

export async function POST(request: Request) {
    await connectToDatabase();
    const { username, email, password, role } = await request.json();

    if (!email || !password) {
        return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
        );
    }

    try {
        const user = new User({ username, email, password, role });
        const savedUser = await user.save();
        console.log("User created: ", savedUser);
        return NextResponse.json({
            message: "User created successfully",
            user: savedUser,
        });
    } catch (error) {
        console.error("Error creating user: ", error);
        return NextResponse.json(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}
