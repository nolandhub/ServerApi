import { create } from "zustand"
import { number, z } from "zod"
import { tripSchema } from "@/config/datafield/tripConfigSchema"

export type Trip = z.infer<typeof tripSchema>

interface TripStore {
    trips: Trip[]

    deleteId: number | null
    openDialog: boolean
    openConfirmDelete: (id: number) => void
    closeDialog: () => void

    editTrip: Trip | null
    openSheet: boolean
    openEditSheet: (trip?: Trip) => void
    closeEditSheet: () => void

    setTrips: (trips: Trip[]) => void
    upsertTrip: (trip: Trip) => void
    removeTrip: (id: number) => void
}

export const useTripStore = create<TripStore>((set) => ({
    trips: [],

    deleteId: null,
    openDialog: false,
    openConfirmDelete: (id) =>
        set({ openDialog: true, deleteId: id }),
    closeDialog: () =>
        set({ openDialog: false, deleteId: null }),

    openSheet: false,
    editTrip: null,
    openEditSheet: (trip) =>
        set({ openSheet: true, editTrip: trip ?? null }),
    closeEditSheet: () =>
        set({ openSheet: false, editTrip: null }),

    upsertTrip: (trip) =>
        set((state) => {
            const exists = state.trips.some((t) => t.id === trip.id)
            return {
                trips: exists
                    ? state.trips.map((t) =>
                        t.id === trip.id ? trip : t
                    )
                    : [trip, ...state.trips],
            }
        }),

    setTrips: (trips) => set({ trips }),

    removeTrip: (id) =>
        set((state) => ({
            trips: state.trips.filter((t) => t.id !== id),
        })),
}))

