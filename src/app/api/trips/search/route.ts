// app/api/trips/route.ts
import { NextResponse } from 'next/server';
import { getTripsWithSales } from '@/services/tripServices';
import { withCors } from "@/utils/withCors";


async function handlerGet(request: Request) {
    const url = new URL(request.url);
    const routeCode = url.searchParams.get('routeCode');
    const departDate = url.searchParams.get('departDate');

    if (!routeCode || !departDate) {
        return NextResponse.json({ error: 'routeCode and departDate are required' }, { status: 400 });
    }
    try {
        const res = await getTripsWithSales(routeCode, departDate)
        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}


export const GET = withCors(handlerGet);


export const OPTIONS = withCors(() => new Response(null, { status: 200 }));



