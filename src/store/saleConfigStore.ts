import { create } from "zustand"

interface SaleConfig {
    id: number
    scopeId: number
    tripId: number | null
    routeId: number | null

    weekdays: number
    startDate: string
    endDate: string

    timeRangeStart: string | null
    timeRangeEnd: string | null

    createAt: string
    updateAt: string | null
    isActive: number
}

interface SaleConfigStore {
    saleConfigs: SaleConfig[]
    addSaleConfig: (saleConfig: SaleConfig) => void
    removeSaleConfig: (id: number) => void
    setSaleConfigs: (saleConfigs: SaleConfig[]) => void
}

export const useSaleConfigStore = create<SaleConfigStore>((set) => ({
    saleConfigs: [],
    addSaleConfig: (saleConfig) => set((state) => ({ saleConfigs: [...state.saleConfigs, saleConfig] })),
    removeSaleConfig: (id) => set((state) => ({ saleConfigs: state.saleConfigs.filter(f => f.id != id) })),
    setSaleConfigs: (saleConfigs) => set({ saleConfigs })
}))