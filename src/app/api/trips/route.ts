import { pool } from "@/app/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [res] = await pool.execute<RowDataPacket[]>(`call proc_trip_get(?)`, [-1])
        return NextResponse.json(res?.[0] || [], { status: 200 })
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
