import { tickSchema } from "@/config/datafield/ticketSchema";
import { z } from "zod";


export type Ticket = z.infer<typeof tickSchema>;

/**
 * Extract pickUp location as string
 */
export const getPickUpLocation = (ticket: Ticket): string => {
    return ticket.pickUp?.title ? `${ticket.pickUp.title}${ticket.pickUp.subtitle ? ` - ${ticket.pickUp.subtitle}` : ""}` : "-";
};

/**
 * Extract dropOff location as string
 */
export const getDropOffLocation = (ticket: Ticket): string => {
    return ticket.dropOff?.title ? `${ticket.dropOff.title}${ticket.dropOff.subtitle ? ` - ${ticket.dropOff.subtitle}` : ""}` : "-";
};

/**
 * Get first option time (departure time from options)
 */
export const getFirstOptionTime = (ticket: Ticket): string => {
    return ticket.option?.[0]?.time ?? "-";
};

/**
 * Get all seat names from options (comma separated)
 */
export const getSeatNames = (ticket: Ticket): string => {
    return ticket.option?.map(o => o.label).join(", ") ?? "-";
};

/**
 * Get total seats from options
 */
export const getTotalSeats = (ticket: Ticket): number => {
    return ticket.option?.length ?? 0;
};

/**
 * Get total option price
 */
export const getTotalOptionPrice = (ticket: Ticket): number => {
    return ticket.option?.reduce((sum, opt) => sum + (opt.subtotal ?? 0), 0) ?? 0;
};

/**
 * Format option array for display (show time, seat name, and price)
 */
export const formatOptions = (ticket: Ticket): string => {
    if (!ticket.option || ticket.option.length === 0) return "-";
    return ticket.option
        .map(opt => `${opt.time} - ${opt.label} (${opt.value.toLocaleString("vi-VN")} VNĐ)`)
        .join(" | ");
};
