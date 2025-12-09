import { pool } from "@/app/db";
import { RowDataPacket } from "mysql2";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await pool.execute<RowDataPacket[]>(
            `CALL proc_trip_delete(?)`,
            [params.id]
        );

        return NextResponse.json({
            success: true,
            message: "Xóa chuyến thành công",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
