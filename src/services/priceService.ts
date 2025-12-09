import { pool } from '@/app/db';
import { rawPrices } from '@/types/rawType';
import { RowDataPacket } from 'mysql2/promise';

export async function getPrices(routeCode: string, departDate: string): Promise<rawPrices[]> {
    const [result] = await pool.execute<RowDataPacket[]>(
        'CALL proc_price_get_by_route_date(?, ?)',
        [routeCode, departDate]
    );
    return (result?.[0] as rawPrices[]) || [];
}