import { createHmac, timingSafeEqual } from "node:crypto";

export interface AdminSession {
	expiresAt: number;
	login: string;
}

function signature(payload: string, secret: string) {
	return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSession(session: AdminSession, secret: string) {
	const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
	return `${payload}.${signature(payload, secret)}`;
}

export function verifyAdminSession(
	token: string,
	secret: string,
	now = Math.floor(Date.now() / 1000)
): AdminSession | null {
	const [payload, providedSignature] = token.split(".");
	if (!(payload && providedSignature)) {
		return null;
	}

	const expectedSignature = signature(payload, secret);
	const provided = Buffer.from(providedSignature);
	const expected = Buffer.from(expectedSignature);
	if (
		provided.length !== expected.length ||
		!timingSafeEqual(provided, expected)
	) {
		return null;
	}

	try {
		const session = JSON.parse(
			Buffer.from(payload, "base64url").toString("utf8")
		) as AdminSession;
		if (
			typeof session.login !== "string" ||
			typeof session.expiresAt !== "number" ||
			session.expiresAt <= now
		) {
			return null;
		}
		return session;
	} catch {
		return null;
	}
}
