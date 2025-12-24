"use client"
import z from "zod";



export const saleConfigSchema = z.object({
    id: z.number(),
    scopeId: z.number(),
    tripId: z.number().nullable(),
    routeId: z.number().nullable(),
    weekdays: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    timeRangeStart: z.string().nullable(),
    timeRangeEnd: z.string().nullable(),
    createAt: z.string(),
    updateAt: z.string().nullable(),
    isActive: z.number()
});
