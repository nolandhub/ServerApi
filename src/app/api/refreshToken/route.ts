import { NextResponse } from "next/server";
import axios from "axios";
import formatErr from "@/helper/formatErr";

export async function POST(req: Request) {
    try {
        const { refresh_token } = await req.json();

        const { data } = await axios.post(
            "https://oauth.zaloapp.com/v4/oa/access_token",
            new URLSearchParams({
                refresh_token,
                app_id: process.env.APP_ID!,
                grant_type: "refresh_token"
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "secret_key": process.env.SECRET_KEY!
                }
            }
        )
        return NextResponse.json(data, { status: 200 })

    } catch (err: unknown) {
        console.error("[refresh-token]", formatErr(err));
        return NextResponse.json(
            {
                error: "Internal Server Error",
                detail: formatErr(err)
            },
            { status: 500 }
        );

    }
}