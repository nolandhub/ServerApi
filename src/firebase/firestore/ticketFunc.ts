import { TicketUpdate } from "@/components/dashboard/view-edit";
import { db } from "@/firebase/fireConfig";
import { Ticket } from "@/typeOf/Firestore_Type";
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
    // Optionally add ordering / filters here
    const q = query(ref, orderBy("createAt", "desc"));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const tickets = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as any),
            })) as Ticket[];
            callback(tickets);
        },
        (error) => {
            console.error("listenTickets onSnapshot error:", error);
        }
    );

    return unsubscribe;
}