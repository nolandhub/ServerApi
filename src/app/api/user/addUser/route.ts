import { NextResponse } from "next/server";
import { userInfo } from "@/typeOf/Firestore_Type";
import { addUser } from "@/firebase/firestore/userFunc";
import formatFireErr from "@/helper/formatFireErr";
import { dummyOptions, withCors } from "@/utils/withCors";

async function postHandler(req: Request) {
    try {
        const body = await req.json();
        const data: userInfo = {
            ...body,
            createAt: new Date().toISOString()
        };
        await addUser(data.id, data)

        return NextResponse.json("Add Success", { status: 200 })

    } catch (err: unknown) {
        console.error("[Add User]", formatFireErr(err));
        return NextResponse.json(
            {
                error: "Internal Server Error",
                detail: formatFireErr(err)
            },
            { status: 500 }
        );
    }
}

export const POST = withCors(postHandler);
export const OPTIONS = withCors(dummyOptions);



