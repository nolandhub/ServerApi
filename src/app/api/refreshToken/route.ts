import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { refresh_token } = await req.json();

    const APP_ID = process.env.APP_ID!;
    const SECRET_KEY = process.env.SECRET_KEY!;

    const url = "https://oauth.zaloapp.com/v4/oa/access_token";
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        app_id: APP_ID,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "secret_key": SECRET_KEY,
        },
        body: body.toString(),
    });

    const data = await response.json();

    return NextResponse.json(data, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Cho phép mọi domain gọi
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

// Xử lý preflight OPTIONS request
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
