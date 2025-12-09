import { pool } from '@/app/db';
import { rawSaleConfig } from '@/types/rawType';
import { RowDataPacket } from 'mysql2/promise';


export async function getSales(routeCode: string, departDate: string): Promise<rawSaleConfig[]> {
    const [result] = await pool.execute<RowDataPacket[]>(
        'CALL proc_sales_get_by_route_date(?, ?)',
        [routeCode, departDate]
    );

    return (result?.[0] as rawSaleConfig[]) || [];
}