import { redis } from "@/lib/redis";
import { FaEye } from "react-icons/fa6";

export default async function ViewCount({ path }: { path: string }) {
    const views = Number(await redis.get("views:global")) || 0;

    return (
        <span className="flex flex-row items-center gap-2 text-base text-muted-foreground">
            <FaEye /> {views.toLocaleString()}
        </span>
    );
}
