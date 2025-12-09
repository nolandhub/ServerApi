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

export interface Route {
    routeId: string
    title: string
    fromLabel: string
    toLabel: string
}

export interface PopRoute extends Route {
    image: string;
    description: string; // "Cung đường đèo ấn tượng quanh co uốn lượn giữa vùng đồi xanh ngát,.."
    price: number;
    note: string;  //"Limousine 20 Phòng Đôi VIP"
}


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



















