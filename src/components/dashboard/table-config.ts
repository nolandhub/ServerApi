/**
 * Cấu hình các tab của bảng dữ liệu
 * Dễ dàng mở rộng thêm tab mới
 */

import { ColumnDef } from "@tanstack/react-table"
import { ticketColumns } from "@/app/config/columns/ticketColumns"
import { saleConfigColumns } from "@/app/config/columns/saleConfigColumns"

export interface TableTab {
    id: string
    label: string
    apiEndpoint?: string
    columns: ColumnDef<any>[]
    badge?: number
    hasBadge?: boolean
}

export const TABLE_TABS: Record<string, TableTab> = {
    booking: {
        id: "booking",
        label: "Danh sách bookings",
        columns: ticketColumns as ColumnDef<any>[],
        hasBadge: true,
    },
    sale: {
        id: "sale",
        label: "Danh sách sale",
        apiEndpoint: "/api/saleConfigs",
        columns: saleConfigColumns as ColumnDef<any>[],
        badge: 3
    }
}

