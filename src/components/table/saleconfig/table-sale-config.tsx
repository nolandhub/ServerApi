import { DataTable } from "@/components/common/data-table"
import { saleConfigColumns } from "@/config/columns/saleConfigColumns"

import { saleConfigSchema } from "@/config/datafield/saleConfigSchema"
import z from "zod"

interface SaleConfigProps {
    data: z.infer<typeof saleConfigSchema>[];
    loading?: boolean
}

export function SaleConfigTable({ data, loading }: SaleConfigProps) {
    return (
        <DataTable
            columns={saleConfigColumns}
            data={data}
            loading={loading}
        />
    )
}
