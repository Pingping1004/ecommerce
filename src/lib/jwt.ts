import { SignJWT, JWTPayload } from "jose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export const signToken = async (payload: JWTPayload) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(SECRET_KEY);
};

export const verifyToken = async () => {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json('Unauthorized', { status: 401 });
        }

        return NextResponse.json({
            message: 'Authorized session',
            user: session.user,
        })
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid token");
    }
};
