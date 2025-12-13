"use client"
import ChartAreaInteractive from "@/components/dashboard/chart-area-interactive"
import { TableTabs } from "@/components/dashboard/data-tables-tabs"
import SectionCards from "@/components/dashboard/section-cards"
// import { SectionCards } from "@/components/dashboard/section-cards"
// import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { Separator } from "@/components/ui/separator"


export default function Page() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">

            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />

                <div className="p-6">
                    <TableTabs />
                </div>
                

                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
            </div>
        </div>
    )
}
