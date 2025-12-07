
"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IconArrowsSort, IconBus, IconCircleCheckFilled, IconClock, IconDotsVertical, IconEye, IconLoader, IconMapPin } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import z from "zod";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { decodeWeekdays } from "@/helper/decodeBitWise";
import { DragHandle } from "@/components/dashboard/data-tables-advance";
import {
    getPickUpLocation,
    getDropOffLocation,
    getFirstOptionTime,
    getSeatNames,
    getTotalSeats,

} from "@/helper/ticketTableHelper";
import PopoverZoomInDemo from "@/components/dashboard/popup-detail";
import { saleConfigSchema } from "../datafield/saleConfigSchema";



export const saleConfigColumns: ColumnDef<z.infer<typeof saleConfigSchema>>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        )
    },
    {
        accessorKey: "scopeId",
        header: "Phạm vi",
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                {
                    (row.original.scopeId && row.original.scopeId === 1)
                        ? <Badge
                            variant="secondary"
                            className="bg-red-500 text-white dark:bg-blue-600"
                        >
                            Toàn hệ thống
                        </Badge>
                        :
                        (row.original.scopeId && row.original.scopeId === 2)
                            ? <Badge
                                variant="secondary"
                                className="bg-green-500 text-white dark:bg-blue-600"
                            >
                                Tuyến đường
                            </Badge>
                            : <Badge
                                variant="secondary"
                                className="bg-blue-500 text-white dark:bg-blue-600"
                            >
                                Chuyến cụ thể
                            </Badge>
                }
            </div>
        )
    },
    {
        accessorKey: "routeId",
        header: "Id tuyến"
    },
    {
        accessorKey: "tripId",
        header: "Id chuyến"
    },
    {
        accessorKey: "weekdays",
        header: "Các thứ áp dụng",
        cell: ({ row }) => {
            const value = row.original.weekdays ?? 0
            const days = decodeWeekdays(value)
            return (days.map((d) =>
                <Badge key={d.bit} className={`${d.color} py-1 mx-1`}>
                    {d.label}
                </Badge>
            ))
        }
    },
    {
        accessorKey: "startDate",
        header: "Ngày bắt đầu",
        cell: ({ row }) => {
            const d = row.original.startDate
            return (
                <div className="text-center w-full">
                    {d ? dayjs(d).format("YYYY-MM-DD") : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
        cell: ({ row }) => {
            const d = row.original.endDate
            return (
                <div className="text-center w-full">
                    {d ? dayjs(d).format("YYYY-MM-DD") : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "timeRangeStart",
        header: "Khung giờ bắt đầu",
        cell: ({ row }) => {
            const time = row.original.timeRangeStart
            return (
                <div className="text-center w-full">
                    {time ? time : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "timeRangeEnd",
        header: "Khung giờ kết thúc",
        cell: ({ row }) => {
            const time = row.original.timeRangeEnd
            return (
                <div className="text-center w-full">
                    {time ? time : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "createAt",
        header: "Thời gian tạo",
        cell: ({ row }) => {
            const d = row.original.createAt
            return (
                <div className="text-center w-full">
                    {d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "updateAt",
        header: "Thời gian cập nhật",
        cell: ({ row }) => {
            const d = row.original.updateAt
            return (
                <div className="text-center w-full">
                    {d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : "-"}
                </div>
            )
        }
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => (
            <>
                {row.original.isActive === 1
                    ? <Badge className="bg-green-500">On</Badge>
                    : <Badge>Off</Badge>}
            </>
        )
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem>Tạo bản sao</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Xóa</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
]
