"use client"
import { DataTable } from "@/components/dashboard/data-table"
import { useEffect } from "react"
import { SectionCards } from "@/components/dashboard/section-cards"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { useTicketStore } from "@/store/ticketStore"
import { getAllTicket, listenTickets } from "@/firebase/firestore/ticketFunc"
import { Separator } from "@/components/ui/separator"


export default function Page() {
    const setTickets = useTicketStore((select) => select.setTickets)
    const tickets = useTicketStore((select) => select.tickets)


    useEffect(() => {
        // 🔥 Bắt đầu lắng nghe
        const unsubscribe = listenTickets((data) => {
            setTickets(data)
        })

        // ✅ Cleanup khi unmount / đổi page
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <DataTable data={tickets} />

                <Separator className="my-6" />
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>

            </div>
        </div>
    )
}
