import { tickSchema } from "@/config/datafield/ticketSchema";
import { z } from "zod";

export type Ticket = z.infer<typeof tickSchema>;

/**
 * Get first option time (departure time from options)
 */
export const getFirstOptionTime = (ticket: Ticket): string => {
    return ticket.option?.[0]?.time ?? "-";
};

