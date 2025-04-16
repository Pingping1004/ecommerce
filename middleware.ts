import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(async function middleware(req: NextRequestWithAuth) {
    const publicPaths = [
        "/signup",
        "/login",
        "favicon.ico",
        "_next/static",
        "/",
    ];
    const authPaths = ["/oauth-callback", "/api/auth/callback", "/api/auth/:"];
    const { pathname } = req.nextUrl;
    const res = NextResponse.next();

    const token =
        req.headers.get("authorization")?.split(" ")[1] ||
        req.cookies.get("next-auth.session-token")?.value;
    const userIsAuthenticated =
        token && (await verifyToken(token).catch(() => null));

    if (pathname === "/") return res;
    if (
        userIsAuthenticated &&
        (pathname === "/login" || pathname === "/signup")
    ) {
        console.log("User is authenticated, redirecting to dynamic personal feed");
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (
        !publicPaths.some((path) => pathname.startsWith(path)) &&
        !authPaths.some((path) => pathname.startsWith(path))
    ) {
        if (!userIsAuthenticated) {
            console.log("No token found, redirecting to /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    res.headers.set("X-Custom-Header", "This is a custom header");
    console.log("Is user authenticated? ", userIsAuthenticated);
    return NextResponse.next();
});
