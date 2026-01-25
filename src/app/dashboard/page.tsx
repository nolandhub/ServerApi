"use client"
import ChartAreaInteractive from "@/components/dashboard/chart-area-interactive"
import { TableTabs } from "@/components/dashboard/data-tables-tabs"
import SectionCards from "@/components/dashboard/section-cards"
// import { SectionCards } from "@/components/dashboard/section-cards"
// import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import Image from "next/image"

export default function Page() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">

            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Image
                    width={200}
                    height={200}
                    src={'https://th.bing.com/th/id/OIP.vrbopt9dj0VSm784eXvGzAHaHa?w=171&h=180&c=7&r=0&o=7&pid=1.7&rm=3'}
                    alt="asd"
                />
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
