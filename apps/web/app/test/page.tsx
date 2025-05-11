'use client';
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function Test() {
    const greet = useQuery({
        ...trpc.test.greet.queryOptions({ name: 'Laxman' }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchInterval: false
    });

    const healthCheck = useQuery({
        ...trpc.test.healthCheck.queryOptions(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchInterval: false
    });

    return (
        <div className="container mx-auto max-w-3xl px-4 py-2">
            <div className="grid gap-6">
                <section className="rounded-lg border p-4">
                    <h2 className="mb-2 font-medium">API Status</h2>
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className="text-sm text-muted-foreground">
                            {healthCheck.isLoading
                                ? "Checking..."
                                : healthCheck.data
                                    ? "Connected"
                                    : "Disconnected"}
                        </span>
                    </div>
                </section>
                <section className="rounded-lg border p-4">
                    <h2 className="mb-2 font-medium">Greet API</h2>
                    <div>
                        {greet.isLoading
                            ? "Loading..."
                            : greet.data
                                ? greet.data
                                : "No greeting"}
                    </div>
                </section>
            </div>
        </div>
    )
}