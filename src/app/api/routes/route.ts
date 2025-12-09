import { pool } from "@/app/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [res] = await pool.execute<RowDataPacket[]>("Select id,route_name as routeName from routes")
        return NextResponse.json(res || [], { status: 200 })
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
