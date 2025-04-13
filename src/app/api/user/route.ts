import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        const session = await getServerSession(authOptions);
        console.log("Receiving token: ", token);
        console.log("Get session: ", session);

        if (!token && !session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        let userEmail = session?.user?.email;
        const user = await User.findOne({ email: userEmail });

        // If token is present, validate it (for normal login users)
        if (!userEmail && token) {
            try {
                const decodedToken: any = verifyToken(token);
                userEmail = decodedToken.email;
                console.log('Decoded email: ', decodedToken.email)
            } catch (err) {
                return NextResponse.json(
                    { error: "Invalid token" },
                    { status: 401 }
                );
            }
        }

        if (!user)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );

        console.log("User data from api/user: ", user);
        return NextResponse.json({ message: "User found", user });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}