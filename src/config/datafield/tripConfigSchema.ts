"use client"
import z from "zod";

export const tripSchema = z.object({
    id: z.number(),
    routeId: z.number(),
    routeName: z.string(),
    compId: z.number(),
    compName: z.string(),
    transferTypeId: z.number(),
    transferTypeName: z.string(),
    priceTypeId: z.number(),
    priceTypeName: z.string(),
    busName: z.string(),
    updateAt: z.string().nullable(),
    createAt: z.string(),
    isActive: z.number()
})

