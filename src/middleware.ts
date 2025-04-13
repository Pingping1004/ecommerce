import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyToken } from "./lib/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const publicPaths = [
        "/signup",
        "/login",
        "favicon.ico",
        "_next/static",
        "/",
    ];
    const authPaths = ["/oauth-callback", "/api/auth/callback", "/api/auth"];

    const bearerToken = req.headers.get("authorization");
    const authHeader = bearerToken?.split(" ")[1];
    const isTokenInAuthHeader = bearerToken?.startsWith("Bearer ");

    if (authHeader) {
        const decoded = verifyToken(authHeader);
    }

    console.log("Auth header: ", authHeader);
    console.log("Token auth header: ", isTokenInAuthHeader);

    const includeAuthPaths = authPaths.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );
    const includePublicPaths = publicPaths.some(
        (path) =>
            req.nextUrl.pathname === path ||
            req.nextUrl.pathname.startsWith(path)
    ); // Ensure exact match for "/"

    console.log("Middleware token:", token);

    // Prevent infinite redirect loop by allowing access to "/login"
    if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/") {
        return NextResponse.next();
    }

    // Prevent accessing protected route api without auth
    if (
        !token &&
        !isTokenInAuthHeader &&
        !includeAuthPaths &&
        !includePublicPaths
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Auth provider: ", req.nextUrl.searchParams.get("provider"));

    return NextResponse.next();
}
