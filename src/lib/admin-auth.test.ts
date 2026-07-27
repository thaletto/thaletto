import { describe, expect, test } from "bun:test";
import { createAdminSession, verifyAdminSession } from "@/lib/admin-auth";

describe("admin sessions", () => {
	test("accepts the configured owner and rejects a tampered session", async () => {
		const secret = "test-secret-with-enough-entropy";
		const token = await createAdminSession(
			{ expiresAt: 1_800_000_000, login: "thaletto" },
			secret
		);

		expect(await verifyAdminSession(token, secret, 1_700_000_000)).toEqual({
			expiresAt: 1_800_000_000,
			login: "thaletto",
		});
		expect(
			await verifyAdminSession(`${token.slice(0, -1)}x`, secret, 1_700_000_000)
		).toBeNull();
	});
});
