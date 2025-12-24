import { NextResponse } from "next/server"
import axios from "axios"
import { buildZaloConfirm } from "@/helper/apiFuncHelper"
import { withCors } from "@/utils/withCors"

export async function handlerPost(req: Request) {
    try {
        const body = await req.json()
        console.log("ZALO CONFIRM BODY:", body)

        const {
            userId,
            customerName,
            route,
            busName,
            departDate,
            option,
            totalPassCount,
            total,
        } = body

        if (
            !userId ||
            !customerName ||
            !route ||
            !busName ||
            !departDate ||
            !total ||
            typeof totalPassCount !== "number"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing or invalid required fields",
                    requiredFields: [
                        "userId",
                        "customerName",
                        "route",
                        "busName",
                        "departDate",
                        "totalPassCount",
                        "total"
                    ]
                },
                { status: 400 }
            )
        }
        const payload = buildZaloConfirm({
            userId,
            customerName,
            route,
            busName,
            option,
            departDate,
            totalPassCount,
            total
        })


        const zaloRes = await axios.post(
            "https://openapi.zalo.me/v3.0/oa/message/transaction",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    access_token: process.env.ZALO_OA_TOKEN
                }
            }
        )

        return NextResponse.json({
            success: true,
            data: zaloRes.data
        })
    } catch (error: any) {
        console.error(
            "[ZALO CONFIRM ERROR]",
            error.response?.data || error
        )

        return NextResponse.json(
            {
                success: false,
                message: "Zalo confirm failed",
                error: error.response?.data || error.message
            },
            { status: 500 }
        )
    }
}


export const POST = withCors(handlerPost);


export const OPTIONS = withCors(() => new Response(null, { status: 200 }));