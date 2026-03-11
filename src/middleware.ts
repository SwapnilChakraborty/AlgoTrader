import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
        const path = req.nextUrl.pathname;

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth && path.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // RBAC Checks
        if (path.startsWith("/vendor")) {
            if (token?.role !== "VENDOR" && token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: () => true, // Let the middleware function above handle the redirect logic
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/vendor/:path*", "/admin/:path*", "/login", "/register"],
};
