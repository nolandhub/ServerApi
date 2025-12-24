"use client"

import { DataTable } from "@/components/common/data-table"
import ConfirmDelete from "@/components/table/table-trip/confirm-delete"
import SheetEdit from "@/components/table/table-trip/sheet-edit"
import { tripColumns } from "@/config/columns/tripColumns"
import { tripSchema } from "@/config/datafield/tripConfigSchema"
import { useTripStore } from "@/store/tripStore"
import z from "zod"

interface TripTableProps {
    data: z.infer<typeof tripSchema>[]
    loading?: boolean
}

export default function TripTable({ data, loading }: TripTableProps) {
    const tripEdit = useTripStore(state => state.editTrip)
    const openSheet = useTripStore(state => state.openSheet)
    const closeSheet = useTripStore(state => state.closeEditSheet)
    const closeDialog = useTripStore(state => state.closeDialog)
    const deleteId = useTripStore(state => state.deleteId)
    const openDialog = useTripStore(state => state.openDialog)

    return (
        <div className="flex-1 p-5">
            <DataTable
                loading={loading}
                data={data}
                columns={tripColumns}
            />
            <SheetEdit openSheet={openSheet} closeSheet={closeSheet} trip={tripEdit} />

            {openDialog && deleteId !== null && deleteId !== undefined && (
                <ConfirmDelete
                    id={deleteId}
                    openDialog={openDialog}
                    closeDialog={closeDialog}
                />
            )}
        </div>
    )
}