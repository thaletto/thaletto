import { getViewData } from "@/lib/views";
import { Suspense } from "react";
import ViewsDashboardClient from "./ViewsDashboardClient";
import { Skeleton } from "@/components/ui/skeleton";
import { mockViewData } from "@/config/views.mock";

export default async function ViewsDashboard() {
    const initialData = await getViewData();
    // const initialData = mockViewData;

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Skeleton />
                </div>
            }
        >
            <ViewsDashboardClient initialData={initialData} />
        </Suspense>
    );
}
