"use client"

import { DataTable } from "@/components/common/data-table"
import { tripColumns } from "@/config/columns/tripColumns"
import { useTripStore } from "@/store/tripStore"
import axios from "axios"
import { useEffect } from "react"


export default function Page() {
    const trips = useTripStore(select => select.trips)
    const setTrips = useTripStore(select => select.setTrips)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get("/api/trips")
                setTrips(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetch()
    }, [])
    return (

        <div className="flex-1 p-5">
            <DataTable data={trips} columns={tripColumns} />
        </div>
    )
}