
"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import z, { keyof } from "zod";
import { tripSchema } from "../datafield/tripConfigSchema";
import { Badge } from "@/components/ui/badge";
import { table } from "console";
import { CirclePlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTripStore } from "@/store/tripStore";


export const tripColumns: ColumnDef<z.infer<typeof tripSchema>>[] = [
    {
        id: "select",
        header: ({ table }) => {
            return (
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
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "routeName",
        header: "Tuyến đường"
    },
    {
        accessorKey: "compName",
        header: "Nhà xe"
    },
    {
        accessorKey: "busName",
        header: "Tên xe"
    },
    {
        accessorKey: "transferTypeId",
        header: "Chiều trung chuyển",
        cell: ({ row }) => {
            const TRANSFER_MAP: Record<number, {
                label: string
                color: string
            }> = {
                1: { label: "Chiều đi", color: "bg-blue-500" },
                2: { label: "Chiều đến", color: "bg-yellow-500" },
                3: { label: "2 Chiều", color: "bg-red-500" },
            }

            const select = TRANSFER_MAP[row.original.transferTypeId]

            if (!select) {
                return <Badge className="bg-gray-500">Chưa chọn</Badge>
            }
            return (
                <Badge className={`${select.color}`}>
                    {select.label}
                </Badge>
            )

        }

    },
    {
        accessorKey: "priceTypeName",
        header: "Loại giá"
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) =>
            <div>
                {
                    row.original.isActive == 1
                        ? <Badge className="bg-green-500">On</Badge>
                        : <Badge>Off</Badge>
                }
            </div>
    },
    {
        id: "actions",
        cell: ({ row }) => {
            // debug: in ra console để xem shape của row
            console.log("DEBUG row.id, row.original:", row.id, row.original);

            const trip = row.original;
            if (!trip) {
                // nếu vẫn crash ở đây, log sẽ cho biết vì sao
                return null;
            }

            const { openEditSheet, openConfirmDelete } = useTripStore.getState();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">...</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => openEditSheet(trip)}>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                console.log("DEBUG delete id:", trip.id);
                                openConfirmDelete(trip.id);
                            }}
                            variant="destructive"
                        >
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    },
    {
        id: "add",
        header: () => {
            const { openEditSheet } = useTripStore.getState()
            return (
                <Tooltip >
                    <TooltipTrigger onClick={() => openEditSheet()} asChild>
                        <Button className="h-7 w-7" variant="outline" size="icon">
                            <CirclePlus />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Thêm chuyến</p>
                    </TooltipContent>
                </Tooltip >
            )
        }

    }
]