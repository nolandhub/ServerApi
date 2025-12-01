export type priceType = "fixed" | "byBed" | "byRow"

export interface basePickDrop {
    title: string
    subtitle: string | null
}


export interface PriceByTime {
    time: string
    detail: PriceDetail[]
}

export interface PriceDetail {
    label: string
    value: number
    saleValue: number | null
    finalPrice: number
}

export interface SaleDetail {
    saleId: number
    label: string
    type: "amount" | "percent"
    value: number
    scope: "system" | "route" | "trip"
    startDate: string
    endDate: string
    updateAt: string
    isActive: boolean
}

export interface Trip {
    tripId: number
    routeId: number
    routeCode: string
    routeName: string
    compCode: string
    compName: string
    busName: string
    priceType: priceType
    transferType: number | null
    pickUp: basePickDrop[] | null
    dropOff: basePickDrop[] | null
}

export interface TripWithSale extends Trip {
    price: PriceByTime[] | []
    saleSnapShot: SaleDetail | null;
}