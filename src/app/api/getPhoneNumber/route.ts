import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const body = await req.json();
        const { user_access_token, token } = body;

        if (!user_access_token || !token) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Theo docs Zalo, endpoint này dùng GET method
        const zaloRes = await fetch("https://graph.zalo.me/v2.0/me/info", {
            method: "GET",
            headers: {
                "access_token": user_access_token,
                "code": token,
                "secret_key": process.env.SECRET_KEY!
            }
        });

        if (!zaloRes.ok) {
            throw new Error(`Zalo API error: ${zaloRes.status}`);
        }

        const result = await zaloRes.json();

        const res = NextResponse.json(result, { status: 200 });

        // CORS headers
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return res;

    } catch (err) {
        console.error("Error in getPhoneNumber:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function OPTIONS() {
    const res = new NextResponse(null, { status: 200 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
}