
"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { userScheme } from "../datafield/userSchema";

export const userColumns: ColumnDef<z.infer<typeof userScheme>>[] = [
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
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar>
                <AvatarImage src={row.original.avatar} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: "name",
        header: "Tên",
    },
    {
        accessorKey: "phone",
        header: "Điện thoại",
    },
    {
        accessorKey: "role",
        header: "Vai trò",
    },
    {
        accessorKey: "totalSpending",
        header: "Tổng chi tiêu",
        cell: ({ row }) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(row.original.totalSpending)
        },
    },
    {
        accessorKey: 'createAt',
        header: 'Thời gian tạo',
        cell: ({ row }) => {
            const timestamp = row.original.createAt
            if (timestamp && timestamp.seconds) {
                const date = new Date(timestamp.seconds * 1000)
                return dayjs(date).format("YYYY-MM-DD HH:mm:ss") // mm là phút
            }
            return "-"
        }
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
        ),
    },
]