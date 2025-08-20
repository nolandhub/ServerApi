import { NextResponse } from "next/server";



export async function Get(req: Request) {

    try {

        const body = await req.json()

        const { user_access_token, token } = body

        const params = new URLSearchParams();
        params.append("user_access_token", user_access_token)
        params.append("token", token)

        const zaloRes = await fetch("https://graph.zalo.me/v2.0/me/info", {
            method: "POST",
            headers: {
                "access_token": user_access_token,
                "code": token,
                "secret_key": process.env.SECRET_KEY!

            },
            body: params.toString()
        });

        const result = await zaloRes.json()

        const res = NextResponse.json(result, { status: 200 })

        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Method", "GET,POST,OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return res


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





// https://graph.zalo.me/v2.0/me/info


// curl --location --request GET <https://graph.zalo.me/v2.0/me/info>
// --header access_token: <user_access_token>
// --header **code: <your token>**
// --header **secret_key: <your zalo app secret key>**
