import { type ViewData } from "@/lib/views";

function generateDates(days = 90): string[] {
    const dates: string[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
}

function generateChartData(dates: string[]) {
    return dates.map((date, i) => {
        // Simulate a realistic growth curve with weekend dips and some spikes
        const base = 30 + Math.floor(i * 0.8);
        const weekend = new Date(date).getDay() % 6 === 0 ? 0.4 : 1;
        const spike = Math.random() > 0.93 ? 2.5 : 1;
        const noise = Math.floor(Math.random() * 20 - 10);
        return {
            date,
            views: Math.max(0, Math.floor(base * weekend * spike + noise)),
        };
    });
}

const dates = generateDates();
const chartData = generateChartData(dates);
const globalTotal = chartData.reduce((sum, d) => sum + d.views, 0);

export const mockViewData: ViewData = {
    globalTotal,
    page: null,
    pageTotals: {
        "/": Math.floor(globalTotal * 0.35),
        "/about": Math.floor(globalTotal * 0.15),
        "/writings": Math.floor(globalTotal * 0.25),
        "/projects": Math.floor(globalTotal * 0.15),
        "/timeline": Math.floor(globalTotal * 0.1),
    },
    chartData,
};
