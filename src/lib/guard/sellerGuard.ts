import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function sellerGuard(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) throw new Error('Unauthorized, please login first');
        if (token.role !== 'seller') throw new Error('Unauthorized, only sellers can access this page');
        return token;
    } catch (error: any) {
        console.error('Failed to access page, you must be seller');
        throw new Error('Failed to access page, you must be seller');
    }
}