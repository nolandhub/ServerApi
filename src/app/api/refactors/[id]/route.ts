import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { pool } from "@/app/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tripId = parseInt(id)

        if (isNaN(tripId)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            );
        }

        const [res, res2] = await pool.execute<RowDataPacket[]>(`call proc_trip_get(?)`, [tripId])


        /*         RowDataPacket -> [] -> 2 index [0] [1]
                    [0] : rows data
                    [1] : meta data



                    subIndex [id:string]  -> get Data key-value console.log(row0[0]['bus_name'])
                            [id:number]   -> get data = array idx


    
                  mysql procedure ->  [res,res2]
                    res  : data + metadata
                    res2 : tableConfig

                  // const row0: RowDataPacket[] = res
                 // console.log(row0[0]['bus_name'])
         */


        return NextResponse.json({ data: res[0] || [] }, { status: 200 })

    } catch (error) {
        console.error('Error upserting trip:', error);
        NextResponse.json({ message: `Lỗi Server không xác định` }, { status: 500 })
    }
}


export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const tripId = parseInt(id)
        if (isNaN(tripId)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            );
        }


        const body = await request.json()
        const { routeId, compId, busName, transferTypeId, priceTypeId } = body;

        if (!routeId || !compId || !busName || !transferTypeId || !priceTypeId) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            );
        }

        const [res] = await pool.query<RowDataPacket[]>(`call proc_trip_upsert(?,?,?,?,?,?)`,
            [tripId, routeId, compId, busName, transferTypeId, priceTypeId]
        )

        return NextResponse.json(
            { data: res[0] || [], message: "Sửa chuyến thành công" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: "Lỗi Server không xác định" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const tripId = parseInt(id)

        if (isNaN(tripId)) {
            return NextResponse.json({ error: "ID Không hợp lệ" }, { status: 400 })
        }

        const [res] = await pool.query<RowDataPacket[]>(`Call proc_trip_delete(?)`, [tripId])

        const affectedRows = res[0][0].affected_rows

        return NextResponse.json(
            {
                affected_rows: affectedRows,
                message: affectedRows > 0
                    ? "Xóa thành công"
                    : "Chuyến không tồn tại hoặc đã bị xóa"
            },
            { status: affectedRows > 0 ? 200 : 404 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Lỗi Server không xác định" },
            { status: 500 }
        );
    }
}