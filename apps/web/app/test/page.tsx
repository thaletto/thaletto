"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Test() {
  const greet = useQuery({
    ...trpc.test.greet.queryOptions({ name: "Laxman" }),
  });

  const healthCheck = useQuery({
    ...trpc.test.healthCheck.queryOptions(),
  });

  const databases = useQuery({
    ...trpc.test.listDatabases.queryOptions(),
    // refetchInterval: 5000,
    // refetchOnWindowFocus: true,
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  healthCheck.data ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Greet API</CardTitle>
          </CardHeader>
          <CardContent>
            {greet.isLoading ? (
              <Skeleton className="h-4 w-[200px]" />
            ) : (
              <p>{greet.data || "No greeting"}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Databases</CardTitle>
          </CardHeader>
          <CardContent>
            {databases.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[220px]" />
              </div>
            ) : databases.data ? (
              <div className="space-y-2">
                {(
                  databases.data as unknown as { id: string; title: string }[]
                ).map((database) => (
                  <div
                    key={database.id}
                    className="rounded-lg border p-3 hover:bg-accent"
                  >
                    {database.title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No databases found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
