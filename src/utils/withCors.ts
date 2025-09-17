// utils/withCors.ts
import { NextResponse } from "next/server";

type Handler = (req: Request) => Promise<Response> | Response;

// function withCors(handler: (req: Request) => Promise<Response> | Response) 

export function withCors(handler: Handler) {
    return async (req: Request): Promise<Response> => {

        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 200,
                headers: corsHeaders(),
            });
        }

        const res = await handler(req);

        if (res instanceof Response) {
            corsHeaders().forEach((v, k) => res.headers.set(k, v));
            return res;
        }

        return NextResponse.json(res, { headers: corsHeaders() });
    };
}

export const dummyOptions = () => new Response(null, { status: 200 });


function corsHeaders() {
    return new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
    });
}
