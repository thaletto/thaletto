"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/views";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/admin/views";
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("dashboard-auth="));
        if (cookie) {
            router.push(redirect);
        }
    }, [router, redirect]);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(false);
        try {
            await login(password);
            document.cookie = "dashboard-auth=1; path=/; max-age=86400; SameSite=lax";
            router.push(redirect);
        } catch {
            setError(true);
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Views Dashboard</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Enter password to view analytics
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">Password</p>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Password"
                        disabled={isLoading}
                    />
                </div>
                {error && (
                    <p className="text-sm text-destructive">
                        Incorrect password
                    </p>
                )}
                <Button
                    className="w-full"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}