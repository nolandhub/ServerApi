import { ExportColumn, mapExportData } from '@/types/exportColumn'
import { Table } from '@tanstack/react-table'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export function useTableExport<TData>() {
    const exportToCSV = (table: Table<TData>, columns: ExportColumn<TData>[]) => {
        const BOM = '\ufeff'
        const selectedRows = table.getSelectedRowModel().rows

        const rawData =
            selectedRows.length > 0
                ? selectedRows.map(row => row.original)
                : table.getFilteredRowModel().rows.map(row => row.original)

        const dataToExport = mapExportData(rawData, columns)

        const csv = Papa.unparse(dataToExport, {
            header: true
        })

        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `file-export-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportToExcel = (table: Table<TData>, columns: ExportColumn<TData>[]) => {
        const selectedRows = table.getSelectedRowModel().rows

        const rawData =
            selectedRows.length > 0
                ? selectedRows.map(row => row.original)
                : table.getFilteredRowModel().rows.map(row => row.original)

        const dataToExport = mapExportData(rawData, columns)

        const worksheet = XLSX.utils.json_to_sheet(dataToExport)
        const workbook = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments')

        const cols = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }]
        worksheet['!cols'] = cols

        XLSX.writeFile(workbook, `file-export-${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    const exportToJSON = (table: Table<TData>) => {
        const selectedRows = table.getSelectedRowModel().rows

        const dataToExport =
            selectedRows.length > 0
                ? selectedRows.map(row => row.original)
                : table.getFilteredRowModel().rows.map(row => row.original)

        const json = JSON.stringify(dataToExport, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `file-export-${new Date().toISOString().split('T')[0]}.json`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return {
        exportToCSV,
        exportToExcel,
        exportToJSON
    }
}