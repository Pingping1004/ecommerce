import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = verifyToken(token);
        return NextResponse.json({ message: 'Access required', user })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}