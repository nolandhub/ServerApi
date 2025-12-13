import { useState } from 'react'
import { Search, CalendarCog, Upload, DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button'
import { DateRangePicker } from './date-range-picker'
import { DateRange } from 'react-day-picker'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu'

import { Dropzone, DropzoneContent, DropzoneEmptyState } from '../ui/shadcn-io/dropzone'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../ui/dialog'
import Papa from 'papaparse'
import * as XLSX from 'xlsx';
import axios from 'axios'
import { DataTable } from './data-table'
import { ColumnDef } from '@tanstack/react-table'



interface DataTableToolbarProps<TData> {
    columns: ColumnDef<TData>[]
    globalFilter: string
    onGlobalFilterChange: (value: string) => void
    onDateRangeUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void
    onExportCSV: () => void
    onExportExcel: () => void
    onExportJSON: () => void
    onDataImport?: (data: any[]) => void
    feature?: {
        rangeDateSort?: boolean
        exportData?: boolean
        importData?: boolean
    }
}

export function DataTableToolbar<TData>({
    columns,
    globalFilter,
    onGlobalFilterChange,
    onDateRangeUpdate,
    onExportCSV,
    onExportExcel,
    onExportJSON,
    onDataImport,
    feature
}: DataTableToolbarProps<TData>) {
    const [files, setFiles] = useState<File[] | undefined>()
    const [data, setData] = useState<any[]>([])


    const handleFileImport = async (files: File[] | undefined) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        try {
            if (fileExtension === 'csv') {
                // Parse CSV file
                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => header.trim(),
                    complete: (results) => {
                        const data = results.data;
                        setData(data)

                    },
                    error: (error) => {
                        console.error('CSV Error:', error);
                    }
                });
            }
            else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                // Parse Excel file
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Lấy sheet đầu tiên
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert sang JSON
                const data = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false,
                    defval: null
                });
                setData(data)

            }
        } catch (error) {
            console.error('Import Error:', error);
        }
    };




    return (
        <div className='flex items-center px-4 py-6 gap-8'>
            {/* Global search */}
            <div className="flex w-[240px] items-center relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm..."
                    value={globalFilter ?? ''}
                    onChange={(e) => onGlobalFilterChange(e.target.value)}
                    className="peer pl-9 h-10"
                />
            </div>

            {/* Date Range Filter */}
            {feature?.rangeDateSort && onDateRangeUpdate && (
                <div className='flex items-center gap-2 overflow-auto'>
                    <CalendarCog />
                    <DateRangePicker
                        onUpdate={onDateRangeUpdate}
                        align="start"
                        locale="vi-VN"
                        showCompare={false}
                    />
                </div>
            )}

            <div className='flex flex-1 justify-end gap-2'>
                {/* Import Data */}
                {feature?.importData && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Upload />Import</Button>
                        </DialogTrigger>
                        <DialogContent >
                            <div className='p-4'>
                                {
                                    data.length === 0
                                        ? <Dropzone
                                            onDrop={(file) => {
                                                setFiles(file)
                                                handleFileImport(file)
                                            }}
                                            onError={console.error}
                                            src={files}
                                        >
                                            <DropzoneEmptyState />
                                            <DropzoneContent />
                                        </Dropzone>
                                        : <DataTable data={data} columns={columns} />
                                }

                            </div>










                            <DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <DialogTrigger>
                                    <Button onClick={() => onDataImport?.(data)} type="button" variant="default">
                                        Import
                                    </Button>
                                </DialogTrigger>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Export Data */}
                {feature?.exportData && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>
                                <DownloadIcon className='mr-2' />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={onExportCSV}>
                                <FileTextIcon className='mr-2 size-4' />
                                Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onExportExcel}>
                                <FileSpreadsheetIcon className='mr-2 size-4' />
                                Export as Excel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onExportJSON}>
                                <FileTextIcon className='mr-2 size-4' />
                                Export as JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}