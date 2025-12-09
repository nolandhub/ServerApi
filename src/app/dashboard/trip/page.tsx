"use client"

import TripTable from "@/components/table/trip/table-trip"
import { useTripStore } from "@/store/tripStore"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Page() {
    const [loading, setLoading] = useState<boolean>(false)
    const trips = useTripStore(select => select.trips)
    const setTrips = useTripStore(select => select.setTrips)

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await axios.get("/api/trips")
                setTrips(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return (
        <div className="flex-1 p-5">
            <TripTable data={trips} loading={loading} />
        </div>
    )
}