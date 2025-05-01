import { router, publicProcedure } from "../lib/trpc"

export const userRouter = router({
    github: publicProcedure.query(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
        try {
            const res = await fetch('https://api.github.com/users/thaletto', { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) throw new Error('Failed to fetch GitHub user');
            const data = await res.json();
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Error('GitHub fetch failed: ' + error.message);
        }
    })
})