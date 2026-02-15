import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/quiz")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/", nextUrl))
            }

            // Allow access to reset-user page for debugging
            if (nextUrl.pathname === "/reset-user") return true;

            return true
        },
    },
    providers: [], // Providers are added in auth.ts
} satisfies NextAuthConfig
