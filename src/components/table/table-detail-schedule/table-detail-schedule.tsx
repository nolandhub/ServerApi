import { ExpandableDataTable } from "@/components/common/expanded-table";
import { detailScheduleColumns } from "@/config/columns/detailScheduleColumns";
import { DetailScheduleSchema } from "@/config/datafield/detailScheduleSchema";

import z from "zod"
import { renderPrice } from "./renderPriceCell";

interface DetailScheduleProps {
    data: z.infer<typeof DetailScheduleSchema>[];
    loading?: boolean
}

export function DetailScheduleTable({ data, loading }: DetailScheduleProps) {
    return (
        <ExpandableDataTable
            columns={detailScheduleColumns}
            data={data}
            getRowCanExpand={(row) => row.original.priceDetails.length > 0}
            renderExpandedRow={renderPrice}
            loading={loading}
        />
    )
}