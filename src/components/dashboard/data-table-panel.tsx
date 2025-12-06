"use client"
import React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {

    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    ColumnDef,
    flexRender,
    Row,
    Table as TanstackTable,
} from "@tanstack/react-table"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"


interface DraggableRowProps<TData> {
    row: Row<TData>
}

function DraggableTableRow<TData>({ row }: DraggableRowProps<TData>) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: (row.original as any).id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

interface DataTablePanelProps<TData> {
    table: TanstackTable<TData>
    columns: ColumnDef<TData>[]
    dataIds: UniqueIdentifier[]
    onDragEnd: (event: DragEndEvent) => void
    isLoading?: boolean
}

export function DataTablePanel<TData>({
    table,
    columns,
    dataIds,
    onDragEnd,
}: DataTablePanelProps<TData>) {
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    return (
        <div className="overflow-hidden rounded-lg border">
            <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
                sensors={sensors}
                id={sortableId}
            >
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                (() => {
                                                    const canSort = header.column.getCanSort?.()
                                                    const sortState = header.column.getIsSorted?.() as false | "asc" | "desc"

                                                    if (canSort) {
                                                        return (
                                                            <button
                                                                type="button"
                                                                onClick={header.column.getToggleSortingHandler()}
                                                                className="inline-flex items-center gap-2"
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
                                                })()
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {table.getRowModel().rows?.length ? (
                            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                {table.getRowModel().rows.map((row) => (
                                    <DraggableTableRow key={row.id} row={row as any} />
                                ))}
                            </SortableContext>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Spinner className="size-6" /> Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    )
}
