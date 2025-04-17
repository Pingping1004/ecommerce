import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function checkToken(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    const session = await getServerSession(authOptions);
    console.log("Auth header received:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token && !session) {
        console.error("Unauthorized access attempt");
        throw new Error("Unauthorized access attempt");
    }

    return token;
}
