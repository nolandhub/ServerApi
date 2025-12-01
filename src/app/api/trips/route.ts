import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await pool.execute<RowDataPacket[]>(`select * from trips`)
        return NextResponse.json({ data: res?.[0] || [] }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}
