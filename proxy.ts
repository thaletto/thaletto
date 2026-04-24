import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { viewsConfig } from "@/config/views";

if (!redis.isOpen) {
    redis.connect();
}

export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin/views")) {
        const authCookie = request.cookies.get("dashboard-auth");
        if (!authCookie) {
            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (pathname.startsWith("/admin/")) {
        return NextResponse.next();
    }

    const pages = [...viewsConfig.pages];
    const isTrackedPage = pages.some(
        (page) => pathname === page || pathname.startsWith(page + "/"),
    );

    if (!isTrackedPage) {
        return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("view-session");
    const date = new Date().toISOString().split("T")[0];
    const viewKey = `views:${pathname}:${date}`;

    if (!sessionCookie) {
        const response = NextResponse.next();

        response.cookies.set("view-session", "1", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 90,
            sameSite: "lax",
            path: "/",
        });

        if (process.env.NODE_ENV === "production") {
            setImmediate(async () => {
                await redis.incr(viewKey);
                await redis.expire(viewKey, 60 * 60 * 24 * 90);
            });
        }

        return response;
    }

    return NextResponse.next();
};