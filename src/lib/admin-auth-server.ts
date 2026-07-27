import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";

export const ADMIN_SESSION_COOKIE = "portfolio_admin";

export async function getAdminSession() {
	const secret = process.env.ADMIN_SESSION_SECRET;
	const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
	if (!(secret && token)) {
		return null;
	}
	return verifyAdminSession(token, secret);
}

export async function requireAdminPage() {
	const session = await getAdminSession();
	if (!session) {
		redirect("/api/auth/github");
	}
	return session;
}
