import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export default function checkToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    try {
        // Decode the token using the same secret used to sign it
        const decoded = verifyToken(token);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}
