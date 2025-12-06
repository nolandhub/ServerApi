'use client'

import { useId, useMemo, useState } from 'react'

import { SearchIcon } from 'lucide-react'

import type { Column, ColumnDef, ColumnFiltersState, RowData, SortingState } from '@tanstack/react-table'
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

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { cn } from '@/lib/utils'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

type Item = {
  id: string
  bookingName: string
  bookingPhone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createAt: string
  total: number
}

const columns: ColumnDef<Item>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    )
  },
  {
    header: 'Tên Booking',
    accessorKey: 'bookingName',
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('bookingName')}</div>
    ),
    meta: {
      filterVariant: 'text'
    }
  },
  {
    header: 'Điện Thoại',
    accessorKey: 'bookingPhone',
    cell: ({ row }) => <div>{row.getValue('bookingPhone')}</div>,
    enableSorting: false,
  },
  {
    header: 'Trạng Thái',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      const styles = {
        'pending':
          'bg-yellow-600/10 text-yellow-600 focus-visible:ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:focus-visible:ring-yellow-400/40',
        'confirmed':
          'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40',
        'cancelled':
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40'
      }[status] || ''

      return (
        <Badge className={(cn('border-none focus-visible:outline-none'), styles)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    enableSorting: true,
    meta: {
      filterVariant: 'select'
    }
  },
  {
    header: 'Ngày Tạo',
    accessorKey: 'createAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createAt') as string)
      return <div>{date.toLocaleDateString('vi-VN')}</div>
    },
    enableSorting: true,
  },
  {
    header: 'Tổng Tiền',
    accessorKey: 'total',
    cell: ({ row }) => {
      const amount = row.getValue('total') as number
      return <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</div>
    },
    enableSorting: false,
  }
]

const items: Item[] = [
  {
    id: 'BK001',
    bookingName: 'Nguyễn Văn A',
    bookingPhone: '0912345678',
    status: 'pending',
    createAt: '2024-01-15T10:30:00Z',
    total: 580000
  },
  {
    id: 'BK002',
    bookingName: 'Trần Thị B',
    bookingPhone: '0987654321',
    status: 'confirmed',
    createAt: '2024-01-14T14:45:00Z',
    total: 1160000
  },
  {
    id: 'BK003',
    bookingName: 'Phạm Văn C',
    bookingPhone: '0901234567',
    status: 'pending',
    createAt: '2024-01-13T09:15:00Z',
    total: 290000
  },
  {
    id: 'BK004',
    bookingName: 'Lê Thị D',
    bookingPhone: '0923456789',
    status: 'cancelled',
    createAt: '2024-01-12T16:20:00Z',
    total: 870000
  },
  {
    id: 'BK005',
    bookingName: 'Hoàng Văn E',
    bookingPhone: '0934567890',
    status: 'confirmed',
    createAt: '2024-01-11T11:00:00Z',
    total: 1450000
  },
  {
    id: 'BK006',
    bookingName: 'Đỗ Thị F',
    bookingPhone: '0945678901',
    status: 'confirmed',
    createAt: '2024-01-10T13:30:00Z',
    total: 580000
  },
  {
    id: 'BK007',
    bookingName: 'Võ Văn G',
    bookingPhone: '0956789012',
    status: 'pending',
    createAt: '2024-01-09T08:45:00Z',
    total: 2030000
  },
  {
    id: 'BK008',
    bookingName: 'Bùi Thị H',
    bookingPhone: '0967890123',
    status: 'cancelled',
    createAt: '2024-01-08T15:10:00Z',
    total: 1160000
  }
]

const DataTableWithColumnFilterDemo = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'price',
      desc: false
    }
  ])

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false
  })

  return (
    <div className='w-full'>
      <div className='rounded-md border'>
        <div className='flex flex-wrap gap-3 px-2 py-6'>
          <div className='w-44'>
            <Filter column={table.getColumn('bookingName')!} />
          </div>
          <div className='w-44'>
            <Filter column={table.getColumn('status')!} />
          </div>
          <div className='w-44'>
            <Filter column={table.getColumn('createAt')!} />
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='bg-muted/50'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='relative h-10 border-t select-none'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className='text-muted-foreground mt-4 text-center text-sm'>Data table with column filter</p>
    </div>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId()
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : ''

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return []

    const values = Array.from(column.getFacetedUniqueValues().keys())

    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr]
      }

      return [...acc, curr]
    }, [])

    return Array.from(new Set(flattenedValues)).sort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), filterVariant])

  if (filterVariant === 'range') {
    return (
      <div className='*:not-first:mt-2'>
        <Label>{columnHeader}</Label>
        <div className='flex'>
          <Input
            id={`${id}-range-1`}
            className='flex-1 rounded-r-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1]
              ])
            }
            placeholder='Min'
            type='number'
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className='-ms-px flex-1 rounded-l-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined
              ])
            }
            placeholder='Max'
            type='number'
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    )
  }

  if (filterVariant === 'select') {
    return (
      <div className='*:not-first:mt-2'>
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={value => {
            column.setFilterValue(value === 'all' ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {sortedUniqueValues.map(value => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className='relative'>
        <Input
          id={`${id}-input`}
          className='peer pl-9'
          value={(columnFilterValue ?? '') as string}
          onChange={e => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type='text'
        />
        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  )
}

export default DataTableWithColumnFilterDemo
