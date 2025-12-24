import { pool } from "@/app/db";
import { RowDataPacket } from "mysql2";
import { NextResponse, NextRequest } from "next/server";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        await pool.execute<RowDataPacket[]>(
            `CALL proc_trip_delete(?)`,
            [id]
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