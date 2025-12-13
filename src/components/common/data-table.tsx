"use client"

import type { ColumnDef, ColumnFiltersState } from '@tanstack/react-table'
import {
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "../dashboard/data-table-pagination"
import { useState } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { TableRowEmpty, TableRowLoading } from './table-row-status'
import { dateRangeFilter } from '@/config/filters/dateRangeFilter'
import { DateRange } from 'react-day-picker'
import { useTableExport } from '@/hooks/use-table-export'
import { DataTableToolbar } from './data-table-toolbar'
import axios from 'axios'

interface DataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    loading?: boolean
    feature?: {
        rangeDateSort?: boolean
        selectedRow?: boolean
        exportData?: boolean
        importData?: boolean, endPoint?: string,
    }
}

export function DataTable<TData>({
    columns,
    data,
    loading,
    feature
}: DataTableProps<TData>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { exportToCSV, exportToExcel, exportToJSON } = useTableExport<TData>()

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            globalFilter
        },
        filterFns: {
            dateRange: dateRangeFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        enableSortingRemoval: false
    })

    const handleDateRangeUpdate = (values: {
        range: DateRange
        rangeCompare?: DateRange
    }) => {
        if (!values.range?.from || !values.range?.to) return
        table
            .getColumn("createAt")
            ?.setFilterValue(values.range)
    }

    const handleDataImport = (data: TData[]) => {
        if (data.length == 1) {
            const res = axios.post("/api/trips/upsert", data)
            console.log(res)

        }

    }



    return (
        <div className='w-full'>
            <div className='rounded-md border'>

                {/* Toolbar */}
                <DataTableToolbar
                    columns={columns}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    onDateRangeUpdate={handleDateRangeUpdate}
                    onExportCSV={() => exportToCSV(table)}
                    onExportExcel={() => exportToExcel(table)}
                    onExportJSON={() => exportToJSON(table)}
                    onDataImport={(data) => handleDataImport(data)}
                    feature={feature}
                />


                {/* Table */}
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : (() => {
                                                const canSort = header.column.getCanSort()
                                                const sortState = header.column.getIsSorted() as
                                                    | false
                                                    | "asc"
                                                    | "desc"

                                                if (canSort) {
                                                    return (
                                                        <button
                                                            type="button"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className="inline-flex items-center gap-2 select-none"
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            <span className="text-muted-foreground">
                                                                {sortState === "asc" ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : sortState === "desc" ? (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronsUpDown className="w-4 h-4 opacity-60" />
                                                                )}
                                                            </span>
                                                        </button>
                                                    )
                                                }

                                                return flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            })()}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {loading && <TableRowLoading colSpan={columns.length} />}

                        {!loading &&
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {!loading && table.getRowModel().rows.length === 0 && (
                            <TableRowEmpty colSpan={columns.length} />
                        )}
                    </TableBody>
                </Table>

                <div className="mt-4 py-2 px-4 lg:px-6">
                    <DataTablePagination table={table} />
                </div>
            </div>
        </div >
    )
}
