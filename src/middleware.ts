import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token");
    const authHeader = req.headers.get('authorization');
    const isTokenInAuthHeader = authHeader?.startsWith('Bearer ');

    // Log token found in Authorization header
    if (isTokenInAuthHeader) {
        console.log('Middleware: token found in Authorization header');
    }

    // // Check if we have either a JWT token in the cookie or OAuth token in the request
    // if (!token && !isTokenInAuthHeader) {
    //     // If there's no token and the request is not for login/signup, redirect to login page
    //     if (!["/login", "/signup", "/oauth-callback"].includes(req.nextUrl.pathname)) {
    //         console.log("Middleware: No token found, redirecting to login page");
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }
    // }

    if ((token ||  isTokenInAuthHeader) || (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/signup" ||
        req.nextUrl.pathname.startsWith("/api/auth/callback") ||
        req.nextUrl.pathname === "/dashboard" // Allow access to dashboard after OAuth login
    )) {
        return NextResponse.next();
    }

    // if (!token && !isTokenInAuthHeader && !["/login", "/signup", "/oauth-callback"].includes(req.nextUrl.pathname)) {
    //     console.log("Middleware: No token found, redirecting to login page");
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }    

    return NextResponse.next();
}
