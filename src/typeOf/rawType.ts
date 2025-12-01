
export interface rawPrices {
    tripId: number
    instanceDate: string
    departTime: string
    label: string
    value: number
}

export interface rawSaleConfig {
    saleId: number
    tripId: number | null
    routeId: number | null
    saleName: string
    saleType: "percent" | "amount"
    saleValue: number
    scope: "system" | "route" | "trip"
    startDate: string
    endDate: string
    timeRangeStart: string | null
    timeRangeEnd: string | null
}