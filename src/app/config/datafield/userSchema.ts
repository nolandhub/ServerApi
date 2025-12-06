"use client"
import { Timestamp } from "firebase/firestore";
import z from "zod";

export const userScheme = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    phone: z.string(),
    role: z.string(),
    totalSpending: z.number(),
    createAt: z.instanceof(Timestamp)
})
