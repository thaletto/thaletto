"use server";
import { redis } from "@/lib/redis";
import { viewsConfig } from "@/config/views";

export interface ViewData {
    globalTotal: number;
    page: string | null;
    pageTotals: Record<string, number>;
    chartData: { date: string; views: number }[];
}

export async function getViewData(page?: string) {
    "use server";
    if (!redis.isOpen) {
        await redis.connect();
    }
    
    const pages = [...viewsConfig.pages];

    const now = new Date();
    const dates: string[] = [];
    const dailyData: Record<string, number> = {};

    for (let i = 89; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const date = d.toISOString().split("T")[0];
        dates.push(date);
    }

    const keys: string[] = [];

    if (page) {
        dates.forEach((date) => {
            keys.push(`views:${page}:${date}`);
        });
    } else {
        pages.forEach((p) => {
            dates.forEach((date) => {
                keys.push(`views:${p}:${date}`);
            });
        });
    }

    const values = await redis.mGet(keys);

    let globalTotal = 0;
    const pageTotals: Record<string, number> = {};

    if (page) {
        let total = 0;
        values.forEach((val, i) => {
            const count = val ? parseInt(val, 10) : 0;
            total += count;
            dailyData[dates[i]] = count;
        });
        globalTotal = total;
    } else {
        pages.forEach((p, pageIndex) => {
            let total = 0;
            dates.forEach((date, dateIndex) => {
                const keyIndex = pageIndex * 90 + dateIndex;
                const val = values[keyIndex];
                const count = val ? parseInt(val, 10) : 0;
                total += count;
                if (!dailyData[date]) {
                    dailyData[date] = 0;
                }
                dailyData[date] += count;
            });
            pageTotals[p] = total;
        });
        globalTotal = Object.values(pageTotals).reduce((a, b) => a + b, 0);
    }

    const chartData = dates.map((date) => ({
        date,
        views: dailyData[date] || 0,
    }));
    return {
        globalTotal,
        page: page || null,
        pageTotals: page ? undefined : pageTotals,
        chartData,
    } as ViewData;
}

export async function login(password: string) {
    "use server";
    const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;
    if (password !== DASHBOARD_PASSWORD) {
        throw new Error("Invalid password");
    }
    return true;
}