
"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";
import { tripSchema } from "../datafield/tripConfigSchema";
import { Badge } from "@/components/ui/badge";
import { table } from "console";
import { CirclePlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


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
        accessorKey: "transferTypeName",
        header: "Trung chuyển"
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Xóa</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
    {
        id: "add",
        header: () =>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className="h-6 w-6" variant="outline" size="icon">
                        <CirclePlus />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Thêm chuyến</p>
                </TooltipContent>
            </Tooltip>
    }
]