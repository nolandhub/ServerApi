// services/tripService.ts
import { pool } from '@/app/db';
import { PriceByTime, SaleDetail, Trip, TripWithSale } from '@/typeOf/rawType';
import { rawPrices, rawSaleConfig } from '@/typeOf/rawType';
import { RowDataPacket } from 'mysql2/promise';

// ============================================================================
// DATABASE QUERIES
// ============================================================================

export async function getTrips(routeCode: string): Promise<Trip[]> {
    const [result] = await pool.execute<RowDataPacket[]>(
        'CALL proc_trip_get_by_route_code(?)',
        [routeCode]
    );
    return result?.[0] as Trip[] || [];
}

export async function getPrices(routeCode: string, departDate: string): Promise<rawPrices[]> {
    const [result] = await pool.execute<RowDataPacket[]>(
        'CALL proc_price_get_by_route_date(?, ?)',
        [routeCode, departDate]
    );

    return (result?.[0] as rawPrices[]) || [];
}

export async function getSales(routeCode: string, departDate: string): Promise<rawSaleConfig[]> {
    const [result] = await pool.execute<RowDataPacket[]>(
        'CALL proc_sales_get_by_route_date(?, ?)',
        [routeCode, departDate]
    );

    return (result?.[0] as rawSaleConfig[]) || [];
}

// ============================================================================
// TRANSFORMATION
// ============================================================================

/**
 * Transform rawSaleConfig sang SaleDetail format
 */
function transformToSaleDetail(rawSale: rawSaleConfig): SaleDetail {
    return {
        saleId: rawSale.saleId,
        label: rawSale.saleName,
        type: rawSale.saleType === 'percent' ? 'percent' : 'amount',
        scope: rawSale.scope,
        value: typeof rawSale.saleValue === 'string'
            ? parseFloat(rawSale.saleValue)
            : rawSale.saleValue,
        startDate: rawSale.startDate,
        endDate: rawSale.endDate,
        updateAt: new Date().toISOString(),
        isActive: true
    };
}

// ============================================================================
// SALE LOGIC
// ============================================================================

/**
 * Kiểm tra giờ khởi hành có nằm trong time range của sale không
 */
function isWithinTimeRange(departTime: string, sale: rawSaleConfig): boolean {
    // Nếu không có time range → áp dụng cho tất cả giờ
    if (!sale.timeRangeStart || !sale.timeRangeEnd) {
        return true;
    }

    const [departHour, departMin] = departTime.split(':').map(Number);
    const [startHour, startMin] = sale.timeRangeStart.split(':').map(Number);
    const [endHour, endMin] = sale.timeRangeEnd.split(':').map(Number);

    const departMinutes = departHour * 60 + departMin;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return departMinutes >= startMinutes && departMinutes <= endMinutes;
}

/**
 * Tìm sale phù hợp nhất cho một trip tại thời điểm cụ thể
 * Priority: Trip > Route > System
 */
function findBestSale(
    tripId: number,
    routeId: number,
    departTime: string,
    saleConfigs: rawSaleConfig[]
): rawSaleConfig | null {
    const validSales = saleConfigs.filter(sale =>
        isWithinTimeRange(departTime, sale)
    );

    const tripSale = validSales.find(s => s.scope === 'trip' && s.tripId === tripId);
    if (tripSale) return tripSale;

    const routeSale = validSales.find(s => s.scope === 'route' && s.routeId === routeId);
    if (routeSale) return routeSale;

    const systemSale = validSales.find(s => s.scope === 'system');
    if (systemSale) return systemSale;

    return null;
}

/**
 * Tính giá sau khi áp dụng sale
 */
function calculateSalePrice(originalPrice: number | string, sale: rawSaleConfig): number {
    const price = typeof originalPrice === 'string'
        ? parseFloat(originalPrice)
        : originalPrice;

    const saleValue = typeof sale.saleValue === 'string'
        ? parseFloat(sale.saleValue)
        : sale.saleValue;

    if (sale.saleType === 'percent') {
        return Math.round(price * (1 - saleValue / 100));
    }
    return Math.max(0, price - saleValue);
}

// ============================================================================
// PRICE MAPPING WITH SALE
// ============================================================================

function getSalePriority(scope: 'system' | 'route' | 'trip'): number {
    if (scope === 'trip') return 3;    //High
    if (scope === 'route') return 2;   // Medium
    if (scope === 'system') return 1;  // Low
    return 0;
}


/**
 * Build price map với cả giá gốc và giá sale trong cùng structure
 */
function buildPriceMapWithSale(
    prices: rawPrices[],
    trips: Trip[],
    saleConfigs: rawSaleConfig[]
): {
    priceMap: Record<number, PriceByTime[]>;
    saleSnapshotMap: Record<number, SaleDetail | null>;
} {
    const priceMap: Record<number, PriceByTime[]> = {};
    const saleSnapshotMap: Record<number, SaleDetail | null> = {};

    const tripLookup = new Map(trips.map(t => [t.tripId, t.routeId]));

    prices.forEach(item => {
        const routeId = tripLookup.get(item.tripId);
        if (routeId === undefined) return;

        // Find Applicable Sale
        const applicableSale = findBestSale(
            item.tripId,
            routeId,
            item.departTime,
            saleConfigs
        );

        //Sort Best Sale Follow Level Sale ( Trip(3)->Route(2)->SysTem(1) )
        const currentSale = saleSnapshotMap[item.tripId]

        if (!currentSale && applicableSale) {
            saleSnapshotMap[item.tripId] = transformToSaleDetail(applicableSale)
        } else if (currentSale && applicableSale) {
            if (getSalePriority(applicableSale.scope) > getSalePriority(currentSale.scope)) {
                saleSnapshotMap[item.tripId] = transformToSaleDetail(applicableSale);
            }
        }

        // Calculate price after sale
        const saleValue = applicableSale
            ? calculateSalePrice(item.value, applicableSale)
            : null;

        // Build price map
        if (!priceMap[item.tripId]) {
            priceMap[item.tripId] = [];
        }

        const existingTimeSlot = priceMap[item.tripId].find(
            p => p.time === item.departTime
        );

        const parsedValue = typeof item.value === 'string'
            ? parseFloat(item.value)
            : item.value;

        if (existingTimeSlot) {
            existingTimeSlot.detail.push({
                label: item.label,
                value: parsedValue,
                saleValue: saleValue,
                finalPrice: saleValue ? saleValue : parsedValue
            });
        } else {
            priceMap[item.tripId].push({
                time: item.departTime,
                detail: [{
                    label: item.label,
                    value: parsedValue,
                    saleValue: saleValue,
                    finalPrice: saleValue ? saleValue : parsedValue
                }]
            });
        }
    });

    return { priceMap, saleSnapshotMap };
}

// ============================================================================
// MAIN MERGE FUNCTION
// ============================================================================

/**
 * Merge trip data with prices & sales
 */
export function mergeTripData(
    trips: Trip[],
    prices: rawPrices[],
    sales: rawSaleConfig[]
): TripWithSale[] {
    const { priceMap, saleSnapshotMap } = buildPriceMapWithSale(
        prices,
        trips,
        sales
    );

    return trips.map(trip => ({
        ...trip,
        price: priceMap[trip.tripId] || [],
        saleSnapShot: saleSnapshotMap[trip.tripId] || null
    }));
}

// ============================================================================
// One For All
// ============================================================================

/**
 * Get data {Trips ,Price, Sales}
 */
export async function getTripsWithSales(
    routeCode: string,
    departDate: string
): Promise<TripWithSale[]> {
    const [trips, prices, sales] = await Promise.all([
        getTrips(routeCode),
        getPrices(routeCode, departDate),
        getSales(routeCode, departDate)
    ]);

    return mergeTripData(trips, prices, sales);
}