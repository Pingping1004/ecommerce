import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function checkToken(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) throw new Error('Unauthorized, please login first');
    return token;
}
