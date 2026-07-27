import { FaEye } from "react-icons/fa6";
import { ensureRedis, redis } from "@/lib/redis";

export default async function ViewCount() {
	if (!(await ensureRedis())) {
		return (
			<span className="flex flex-row items-center gap-2 text-base text-muted-foreground">
				<FaEye /> 0
			</span>
		);
	}
	const views = Number((await redis.get("views:global")) ?? 0);

	return (
		<span className="flex flex-row items-center gap-2 text-base text-muted-foreground">
			<FaEye /> {views.toLocaleString()}
		</span>
	);
}
