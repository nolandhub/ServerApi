"use client"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react"
import { Table as TanstackTable } from "@tanstack/react-table"
import { TABLE_TABS, TableTab } from "./table-config"

interface DataTableToolbarProps<TData> {
    table: TanstackTable<TData>
    onTabChange: (value: string) => void
    pendingCount?: number
}

export function DataTableToolbar<TData>({
    table,
    onTabChange,
    pendingCount = 0,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between px-4 lg:px-6">
            <Label htmlFor="view-selector" className="sr-only">
                View
            </Label>

            {/* Mobile view selector */}
            <Select defaultValue="Danh sách vé">
                <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
                    <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(TABLE_TABS).map((tab) => (
                        <SelectItem key={tab.id} value={tab.id}>
                            {tab.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Desktop tabs */}
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                {Object.values(TABLE_TABS).map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} onClick={() => onTabChange(tab.id)}>
                        {tab.label}
                        {tab.hasBadge && pendingCount > 0 && (
                            <Badge variant="secondary">{pendingCount}</Badge>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* Column visibility dropdown */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconLayoutColumns />
                            <span className="hidden lg:inline">Tùy chỉnh cột</span>
                            <span className="lg:hidden">Columns</span>
                            <IconChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
