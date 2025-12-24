'use client'

import { Fragment } from 'react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { dateRangeFilter } from '@/config/filters/dateRangeFilter'
import { Skeleton } from '../ui/skeleton'

type ExpandableDataTableProps<TData> = {
    data: TData[]
    columns: ColumnDef<TData>[]
    getRowCanExpand?: (row: Row<TData>) => boolean
    renderExpandedRow?: (row: Row<TData>) => React.ReactNode,
    loading?: boolean
    emptyText?: string
}


export function ExpandableDataTable<TData>({
    data,
    columns,
    getRowCanExpand,
    renderExpandedRow,
    loading,
    emptyText = 'No results.'
}: ExpandableDataTableProps<TData>) {

    const table = useReactTable({
        data,
        columns,
        getRowCanExpand,
        filterFns: {
            dateRange: dateRangeFilter
        },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        enableSortingRemoval: false
    })
    return (
        <div className='rounded-md border'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns.length }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                            <Fragment key={row.id}>
                                <TableRow data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {row.getIsExpanded() && renderExpandedRow && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={row.getVisibleCells().length}
                                            className="p-0"
                                        >
                                            {renderExpandedRow(row)}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {emptyText}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>


            </Table>
        </div>
    )
}
