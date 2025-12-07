"use client"
import { Timestamp } from "firebase/firestore";
import z from "zod";


export const tickSchema = z.object({
    id: z.string(), //id ticket PRBXXXXXX

    zaloId: z.string(),
    tripId: z.number(),
    bookingName: z.string(),
    bookingPhone: z.string(),
    bookingDate: z.string(),

    routeName: z.string(),
    compName: z.string(),
    busName: z.string(),

    pickUp: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
    }),
    dropOff: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
    }),
    option: z.array(z.object(
        {
            time: z.string(),  //time
            label: z.string(), //seat name
            value: z.number(), // price
            quantity: z.number(),
            subtotal: z.number(), //sub price Option
        })),
    pickUpNote: z.string(),
    dropOffNote: z.string(),

    status: z.string(),
    total: z.number(),  //Price
    totalPassCount: z.number(), //Quantities of passenger

    seatName: z.string(),
    busNumber: z.string().optional(),
    cancelReason: z.string().optional(),

    createAt: z.string(),
    updateAt: z.instanceof(Timestamp).optional(),
    createUser: z.string(),
    isDelete: z.boolean()
})