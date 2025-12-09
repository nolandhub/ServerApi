
"use client"
import { Badge } from "@/components/ui/badge";
import { IconClock } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";
import dayjs from "dayjs";
import { getFirstOptionTime } from "@/helper/ticketTableHelper";
import { tickSchema } from "../datafield/ticketSchema";
import PopoverDetailBooking from "@/components/dashboard/popup-detail";
import { CalendarDaysIcon } from "lucide-react";
import { TicketQuickEditDrawer } from "@/components/dashboard/ticket-draw-edit";


export const ticketColumns: ColumnDef<z.infer<typeof tickSchema>>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "routeName",
        header: "Tuyến đường",
    },
    {
        accessorKey: "bookingName",
        header: "Khách Hàng",
        cell: ({ row }) => (
            <TicketQuickEditDrawer item={row.original} />
        )
    },
    {
        accessorKey: "bookingPhone",
        header: "Điện thoại",
    },
    {
        id: "details",
        header: () => <div className=" text-center">Chi tiết</div>,
        cell: ({ row }) => (
            <div className="flex justify-center items-center">
                <PopoverDetailBooking data={row.original} />
            </div>
        ),
    },
    {
        id: "optionTime",
        header: () => <div className="text-center">Giờ khởi hành</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-1 text-sm">
                <IconClock className="size-4" />
                {getFirstOptionTime(row.original)}
            </div>
        ),
    },
    {
        id: "createAt",
        accessorFn: row =>
            row.createAt ? new Date(row.createAt).getTime() : null,
        header: "Ngày đặt",
        cell: ({ getValue }) => {
            const value = getValue<number | null>()
            return value
                ? new Date(value).toLocaleString("vi-VN")
                : "-"
        },
        sortingFn: "basic",
        filterFn: "dateRange"
    },
    {
        accessorKey: "bookingDate",
        header: () => <div className="text-center">Ngày đi</div>,
        cell: ({ row }) =>
            <div className="flex gap-1 items-center">
                <CalendarDaysIcon size={16} />
                {dayjs(row.original.bookingDate).format("DD-MM-YYYY")}
            </div>
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Trạng thái</div>,
        cell: ({ row }) => {
            const status = row.original.status;
            const statusMap: Record<string, { color: string; label: string }> = {
                confirmed: { color: "bg-green-500", label: "Xác nhận" },
                pending: { color: "bg-yellow-500", label: "Chờ xác nhận" },
                cancelled: { color: "bg-red-500", label: "Đã hủy" },
                used: { color: "bg-blue-500", label: "Hoàn thành" }
            };
            const config = statusMap[status] || { color: "bg-gray-500", label: status };
            return (
                <div className="flex justify-center">
                    <Badge className={`${config.color} text-white`}>
                        {config.label}
                    </Badge>
                </div>
            );
        },
    }
]