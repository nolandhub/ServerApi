"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { TabsContent, Tabs } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IconGripVertical } from "@tabler/icons-react"
import { useSortable } from "@dnd-kit/sortable"

import axios from "axios"
import { saveOrderToLocalStorage, sortByLocalStorageOrder } from "@/services/orderService"
import { TABLE_TABS } from "./table-config"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePanel } from "./data-table-panel"
import { DataTablePagination } from "./data-table-pagination"

// DragHandle component
export function DragHandle({ id }: { id: number | string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

interface DataTableProps {
  data: any[]
}

export function DataTableAdvance({ data: initialData }: DataTableProps) {
  // State management
  const [activeTab, setActiveTab] = React.useState<string>("booking")
  const [data, setData] = React.useState<any[]>(initialData)
  const [columnsState, setColumnsState] = React.useState<ColumnDef<any>[]>(
    () => TABLE_TABS.booking.columns as ColumnDef<any>[]
  )

  // Table state
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Calculate pending count
  const pendingCount = React.useMemo(() => {
    return data.filter(
      (item) => item.status === "pending" || item.status === "Pending"
    ).length
  }, [data])

  // Sync data when initialData changes
  React.useEffect(() => {
    const sortedData = sortByLocalStorageOrder(initialData, activeTab)
    setData(sortedData)
  }, [initialData, activeTab])

  // Handle tab change
  const handleChangeTab = async (tabId: string) => {
    setActiveTab(tabId)
    const tab = TABLE_TABS[tabId]


    try {
      setColumnsState(tab.columns as ColumnDef<any>[])
      if (tabId === "booking") {
        const sortedData = sortByLocalStorageOrder(initialData, tabId)
        setData(sortedData)
      } else if (tab.apiEndpoint) {
        const response = await axios.get(tab.apiEndpoint)
        const fetchedData = response.data.data || []
        const sortedData = sortByLocalStorageOrder(fetchedData, tabId)
        setData(sortedData)
      } else {
        const sortedData = sortByLocalStorageOrder(initialData, tabId)
        setData(sortedData)
      }
    } catch (err) {
      console.error("Error changing tab:", err)
      toast.error("Failed to load data for tab.")
    }
  }


  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // Setup table
  const table = useReactTable({
    data,
    columns: columnsState,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        const newData = arrayMove(prevData, oldIndex, newIndex)

        saveOrderToLocalStorage(activeTab, newData)
        return newData
      })
    }
  }

  return (
    <>
      <Tabs
        value={activeTab}
        className="w-full flex-col justify-start gap-6"
        onValueChange={handleChangeTab}
      >
        {/* Toolbar */}
        <DataTableToolbar
          table={table}
          onTabChange={handleChangeTab}
          pendingCount={pendingCount}
        />

        {/* Booking Tab */}
        <TabsContent
          value="booking"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {/* Table Panel */}
          <DataTablePanel
            table={table}
            columns={columnsState}
            dataIds={dataIds}
            onDragEnd={handleDragEnd}
          />
        </TabsContent>

        {/* Sale Tab */}
        <TabsContent value="sale" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          {/* Table Panel - no filters for sale */}
          <DataTablePanel
            table={table}
            columns={columnsState}
            dataIds={dataIds}
            onDragEnd={handleDragEnd}
          />
        </TabsContent>
      </Tabs>

      {/* Shared Pagination (single instance for all tabs) */}
      <div className="mt-4 px-4 lg:px-6">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
