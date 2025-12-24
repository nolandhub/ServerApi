import { buildZaloPayload } from "@/helper/apiFuncHelper"
import { withCors } from "@/utils/withCors"
import axios from "axios"
import { NextResponse } from "next/server"

interface SendMessageBody {
    userId: string
    customerName: string
    route: string
    status: string
}

export async function handlerPost(req: Request) {
    try {
        const body = (await req.json()) as SendMessageBody
        const { userId, customerName, route, status } = body

        if (!userId || !customerName || !route || !status) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            )
        }

        const payload = buildZaloPayload({
            userId,
            customerName,
            route,
            status
        })

        const zaloRes = await axios.post(
            "https://openapi.zalo.me/v3.0/oa/message/transaction",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    access_token: process.env.ZALO_OA_TOKEN! // ❗ đưa vào env
                }
            }
        )

        return NextResponse.json({
            message: "Send message success",
            data: zaloRes.data
        })
    } catch (error: any) {
        console.error("ZALO ERROR:", error.response?.data || error.message)

        return NextResponse.json(
            {
                message: "Internal server error",
                error: error.response?.data || error.message
            },
            { status: 500 }
        )
    }
}


export const POST = withCors(handlerPost);


export const OPTIONS = withCors(() => new Response(null, { status: 200 }));