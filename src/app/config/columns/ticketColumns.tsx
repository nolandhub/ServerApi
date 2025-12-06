
"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { IconClock, IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";
import dayjs from "dayjs";
import { DragHandle } from "@/components/dashboard/data-table";
import { getFirstOptionTime } from "@/helper/ticketTableHelper";
import { tickSchema } from "../datafield/ticketSchema";
import PopoverDetailBooking from "@/components/dashboard/popup-detail";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon } from "lucide-react";
import { ViewEditTicket } from "@/components/dashboard/view-edit";


export const ticketColumns: ColumnDef<z.infer<typeof tickSchema>>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "bookingName",
        header: "Khách Hàng",
        cell: ({ row }) => (
            <ViewEditTicket item={row.original} />
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
        accessorKey: "routeName",
        header: "Tuyến đường",
    },
    {
        accessorKey: "bookingDate",
        header: () => <div className="text-center">Ngày đi</div>,
        cell: ({ row }) =>
            <div className="flex gap-1 items-center justify-center">
                <CalendarDaysIcon size={16} />
                {dayjs(row.original.bookingDate).format("DD-MM-YYYY")}
            </div>
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
    },
    {
        accessorKey: "createAt",
        header: () => <div className="text-center">Ngày tạo</div>,
        cell: ({ row }) => (
            <div className="text-sm">
                {row.original.createAt ? dayjs(row.original.createAt).format("DD-MM-YYYY HH:mm") : "-"}
            </div>
        ),
    }
]