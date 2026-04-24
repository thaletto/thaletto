import { cookies } from "next/headers";

const SESSION_COOKIE = "session_id";

export async function getSessionId(): Promise<string> {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookieStore.set(SESSION_COOKIE, sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
        });
    }

    return sessionId;
}