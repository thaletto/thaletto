import { randomBytes } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "github_oauth_state";

export function GET(request: NextRequest) {
	const clientId = process.env.GITHUB_CLIENT_ID;
	if (!clientId) {
		return NextResponse.json(
			{ error: "GitHub OAuth is not configured" },
			{ status: 503 }
		);
	}
	const state = randomBytes(24).toString("base64url");
	const authorize = new URL("https://github.com/login/oauth/authorize");
	authorize.searchParams.set("client_id", clientId);
	authorize.searchParams.set(
		"redirect_uri",
		new URL("/api/auth/github/callback", request.url).toString()
	);
	authorize.searchParams.set("state", state);
	const response = NextResponse.redirect(authorize);
	response.cookies.set(STATE_COOKIE, state, {
		httpOnly: true,
		maxAge: 600,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
	return response;
}
