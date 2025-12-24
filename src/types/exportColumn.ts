export type ExportColumn<T> = {
    key: string              // internal key
    header: string           // header trong file
    accessor: (row: T) => any
}

export function mapExportData<T>(
    rows: T[],
    columns: ExportColumn<T>[]
) {
    return rows.map(row => {
        const obj: Record<string, any> = {}
        columns.forEach(col => {
            obj[col.header] = col.accessor(row)
        })
        return obj
    })
}

export const TRIP_EXPORT_COLUMN: ExportColumn<any>[] = [
    {
        key: "routeName",
        header: 'Tuyến đường',
        accessor: r => r.routeName
    },
    {
        key: "compName",
        header: 'Nhà xe',
        accessor: r => r.compName
    },
    {
        key: "busName",
        header: 'Tên xe',
        accessor: r => r.busName
    },
    {
        key: "transferTypeName",
        header: 'Chiều trung chuyển',
        accessor: r => r.transferTypeName
    },
    {
        key: "priceTypeName",
        header: 'Loại giá',
        accessor: r => r.priceTypeName
    }
]