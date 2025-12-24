import { TicketUpdate } from "@/components/dashboard/ticket-draw-edit";
import { db } from "@/firebase/fireConfig";
import { Ticket } from "@/types/Firestore_Type";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    Timestamp,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
import { useRef } from "react";
import { toast } from "sonner";


const TICKET_COLLECTION = "tickets";
export async function getAllTicket() {
    const ref = collection(db, TICKET_COLLECTION);
    const snap = await getDocs(ref);
    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
    })) as Ticket[];
}

export async function mergeTicket(ticketId: string, data: TicketUpdate) {
    const ref = doc(db, TICKET_COLLECTION, ticketId);

    await setDoc(ref, data, {
        merge: true,
    });
}


/**
 * Listen to realtime updates for tickets collection.
 * Returns an unsubscribe function.
 * Usage:
 * const unsubscribe = listenTickets((tickets) => setTickets(tickets))
 * // later: unsubscribe()
 */
export function listenTickets(callback: (tickets: Ticket[]) => void) {
    const ref = collection(db, TICKET_COLLECTION);
    let isInitialLoad = true
    // Optionally add ordering / filters here
    const q = query(ref, orderBy("createAt", "desc"));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const tickets = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Ticket[];

            if (!isInitialLoad) {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        toast.success(`Có 1 vé mới vừa được tạo!`)
                    }
                });
            }
            isInitialLoad = false


            callback(tickets);
        },
        (error) => {
            console.error("listenTickets onSnapshot error:", error);
        }
    );

    return unsubscribe;
}