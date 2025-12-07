import { create } from "zustand"
import { z } from "zod"
import { tripSchema } from "@/config/datafield/tripConfigSchema"

export type Trip = z.infer<typeof tripSchema>

interface TripStore {
    trips: Trip[]
    setTrips: (trips: Trip[]) => void
}

export const useTripStore = create<TripStore>((set) => ({
    trips: [],
    setTrips: (trips) => set({ trips }),
}))
