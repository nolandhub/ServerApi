import { DataTable } from "@/components/common/data-table"
import { ticketColumns } from "@/config/columns/ticketColumns"
import { Ticket } from "@/helper/ticketTableHelper"

interface TicketTableProps {
    data: Ticket[]
    loading?: boolean
}

export function TicketTable({ data, loading }: TicketTableProps) {
    return (
        <DataTable
            columns={ticketColumns}
            data={data}
            loading={loading}
            feature={{
                rangeDateSort: true,
                importData: true,
                exportData: true

            }}
        />
    )
}
