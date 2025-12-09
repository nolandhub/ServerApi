import { pool } from "@/app/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()

    const {
        id,
        routeId,
        compId,
        busName,
        transferTypeId,
        priceTypeId,
    } = body

    if (!routeId || !compId || !busName || !transferTypeId || !priceTypeId) {
        return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 }
        )
    }

    try {
        const [rows]: any = await pool.query(
            `
      CALL proc_trip_upsert(?, ?, ?, ?, ?, ?)
      `,
            [
                id ?? null,
                routeId,
                compId,
                busName,
                transferTypeId,
                priceTypeId,
            ]
        )

        const trip = rows?.[0]?.[0]

        return NextResponse.json({
            success: true,
            data: trip,
        })
    } catch (error: any) {
        console.error("proc_trip_upsert error:", error)

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}
