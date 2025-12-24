import { z } from "zod";

export const PriceDetails = z.object({
    priceInstanceId: z.number(),
    seatTypeId: z.number(),
    label: z.string(),
    adjustedPrice: z.number(),
    basePrice: z.number(),
});

export const PriceByTime = z.object({
    time: z.string(),
    detail: z.array(PriceDetails),
});

export const PriceRules = z.object({
    ruleId: z.number(),
    weekdays: z.number(),
    adjustType: z.enum(["amount", "percent"]),
    value: z.number(),
    timeRangeEnd: z.string().nullable(),
    timeRangeStart: z.string().nullable(),
});

export const Sale = z.object({
    saleId: z.number(),
    saleName: z.string(),
    saleType: z.enum(["amount", "percent"]),
    value: z.number(),
    scopeId: z.number(),
    weekdays: z.number(),
    timeRangeEnd: z.string().nullable(),
    timeRangeStart: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
});

export const DetailScheduleSchema = z.object({
    stt: z.number(),
    tripId: z.number(),
    routeId: z.number(),
    compId: z.number(),
    routeName: z.string(),
    compName: z.string(),
    busName: z.string(),
    priceTypeName: z.string(),
    instanceDate: z.string(),
    priceDetails: z.array(PriceByTime),
    priceRules: z.array(PriceRules).nullable(),
    sales: Sale.nullable(),
    isActive: z.number(),
});
