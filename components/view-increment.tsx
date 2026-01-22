"use client";

import { useEffect } from "react";
import { incrementGlobalView } from "@/lib/actions";
import { getSessionId } from "@/lib/session";

export default function ViewIncrement() {
    useEffect(() => {
        const sessionId = getSessionId();
        incrementGlobalView(sessionId);
    }, []);

    return null;
}
