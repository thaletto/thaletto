"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

type ShortcutMap = Record<string, string>;

export function useKeyboardNavigation(shortcuts: ShortcutMap) {
    const router = useRouter();
    const shortcutsRef = useRef(shortcuts);

    // keep ref updated without re-binding listener
    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            // ignore typing contexts
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            // no modifiers, no repeats
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.repeat)
                return;

            const key = e.key.toLowerCase();
            const route = shortcutsRef.current[key];

            if (!route) return;

            e.preventDefault();
            router.push(route);
        };

        // MUST be window for App Router
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [router]);
}

export default function KeyboardShortcuts() {
    const shortcuts = useMemo(
        () => ({
            a: "/",
            p: "/projects",
            w: "/writings",
            t: "/timeline",
        }),
        [],
    );

    useKeyboardNavigation(shortcuts);
    return null;
}
