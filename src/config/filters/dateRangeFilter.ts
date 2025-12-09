import { FilterFn } from "@tanstack/react-table"

export const dateRangeFilter: FilterFn<any> = (
    row,
    columnId,
    value
) => {
    if (!value) return true

    const { from, to } = value
    const rowValue = row.getValue<number | null>(columnId)

    if (!rowValue) return false

    const time = new Date(rowValue).getTime()

    if (from && time < new Date(from).setHours(0, 0, 0, 0)) return false
    if (to && time > new Date(to).setHours(23, 59, 59, 999)) return false

    return true
}
