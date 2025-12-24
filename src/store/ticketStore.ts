import { Ticket } from "@/types/Firestore_Type";
import { create } from "zustand";


interface TicketStore {
    tickets: Ticket[]
    // editTicket: (ticket: Ticket) => void
    setTickets: (tickets: Ticket[]) => void
}

export const useTicketStore = create<TicketStore>((set) => ({
    tickets: [],
    setTickets: (tickets) => set({ tickets }),
}));