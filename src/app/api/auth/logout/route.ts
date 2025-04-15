import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const response = NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
    );

    // Clear the next-auth session cookie
    const sessionCookie = serialize("next-auth.session-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Expire immediately
    });

    response.headers.append("Set-Cookie", sessionCookie);
    console.log("Clearing next-auth session cookie");

    return response;
}
