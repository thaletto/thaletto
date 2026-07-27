import { type NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth-server";

const STATE_COOKIE = "github_oauth_state";

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code");
	const state = request.nextUrl.searchParams.get("state");
	const expectedState = request.cookies.get(STATE_COOKIE)?.value;
	const clientId = process.env.GITHUB_CLIENT_ID;
	const clientSecret = process.env.GITHUB_CLIENT_SECRET;
	const sessionSecret = process.env.ADMIN_SESSION_SECRET;
	if (
		!(
			code &&
			state &&
			expectedState &&
			state === expectedState &&
			clientId &&
			clientSecret &&
			sessionSecret
		)
	) {
		return NextResponse.redirect(new URL("/?admin=denied", request.url));
	}

	const tokenResponse = await fetch(
		"https://github.com/login/oauth/access_token",
		{
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: new URL(
					"/api/auth/github/callback",
					request.url
				).toString(),
			}),
			headers: {
				accept: "application/json",
				"content-type": "application/json",
			},
			method: "POST",
		}
	);
	const tokenData = (await tokenResponse.json()) as { access_token?: string };
	if (!tokenData.access_token) {
		return NextResponse.redirect(new URL("/?admin=denied", request.url));
	}
	const userResponse = await fetch("https://api.github.com/user", {
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${tokenData.access_token}`,
			"x-github-api-version": "2022-11-28",
		},
	});
	const user = (await userResponse.json()) as { login?: string };
	const owner = process.env.GITHUB_ADMIN_LOGIN ?? "thaletto";
	if (user.login?.toLowerCase() !== owner.toLowerCase()) {
		return NextResponse.redirect(new URL("/?admin=denied", request.url));
	}

	const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
	const session = await createAdminSession(
		{ expiresAt, login: user.login },
		sessionSecret
	);
	const response = NextResponse.redirect(new URL("/admin", request.url));
	response.cookies.delete(STATE_COOKIE);
	response.cookies.set(ADMIN_SESSION_COOKIE, session, {
		expires: new Date(expiresAt * 1000),
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
	return response;
}
