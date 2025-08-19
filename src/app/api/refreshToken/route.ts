import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { refresh_token } = body;

        // Gọi đến Zalo API để lấy access_token mới
        const params = new URLSearchParams();
        params.append("refresh_token", refresh_token);
        params.append("app_id", process.env.APP_ID!);
        params.append("grant_type", "refresh_token");

        const zaloRes = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "secret_key": process.env.SECRET_KEY!,
            },
            body: params.toString(), // gửi đúng dạng form-urlencoded
        });
        const result = await zaloRes.json();

        const res = NextResponse.json(result, { status: 200 });
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return res;
    } catch (err) {
        console.error("Error in refreshToken:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    const res = new NextResponse(null, { status: 200 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
}
