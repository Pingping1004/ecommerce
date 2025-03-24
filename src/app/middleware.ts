import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (
        !token &&
        req.nextUrl.pathname !== "/auth/login" &&
        req.nextUrl.pathname !== "/auth/signup"
    ) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}
