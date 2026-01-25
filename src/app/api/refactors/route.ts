import { pool } from "@/app/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [res] = await pool.execute<RowDataPacket[]>(`Select * from trips`)
        return NextResponse.json(res || [], { status: 200 })
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json(
            { error: 'Không thể tải danh sách chuyến đi' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            id = null,
            routeId,
            compId,
            busName,
            transferTypeId = null,
            priceTypeId
        } = body;

        if (!routeId || !compId || !busName || !priceTypeId) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            );
        }

        const [result] = await pool.query<RowDataPacket[]>(
            `CALL proc_trip_upsert(?, ?, ?, ?, ?, ?)`,
            [id, routeId, compId, busName, transferTypeId, priceTypeId]
        );

        return NextResponse.json(
            {
                data: result[0],
                message: id ? 'Cập nhật chuyến đi thành công' : 'Tạo chuyến đi thành công'
            },
            { status: id ? 200 : 201 }
        );
    } catch (error) {
        console.error('Error upserting trip:', error);
        return NextResponse.json(
            { error: 'Không thể lưu thông tin chuyến đi' },
            { status: 500 }
        );
    }
}