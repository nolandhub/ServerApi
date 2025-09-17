
//User INFO
export type userInfo = {

    id: string,
    name: string,
    avatar: string,
    role: string,
    totalSpending: number
    phone?: string,
    createAt: string

};





































export type BookingFormData = {
    fullName: string;
    phone: string;
    from: string;
    to: string;
    passengerCount: number;
}
export type suggestionsTrip = {
    label: string;
    value: string;
}


//Company

export type busCompany = {
    id: string,
    companyName: string,
    logo: string,
    description: string,
}

//Trip

export type trip = {
    id: string
    companyId: string // id Company
    routeId: string

    pickDetails: {
        time: string
        pickUpAddress: string
        description: string
    }[];

    dropDetails: {
        time: string
        dropOffAddress: string
        description: string
    }[];

}


//Route
// export type route = {
//     id: string, // chuẩn format (vd: saigon-nhatrang <=> Sài Gòn - Nha Trang) 
//     from: string,
//     to: string
// }

//Price
export type pricingPolicy = {
    companyId: string //id company
    companyName: string
    routeId: string
    typeBus: string
    pricingType: "fixed" | "bySeat" | "byRoom"; // đồng giá / theo ghế / theo phòng
    pricingDetails: {
        label: string;    // Ví dụ: "Phòng Đơn 1 Khách"
        price: number;    // 450000
    }[];
    departureTime: string;
    note?: string;
}



export type roadmap = {
    routeId: string,
    companyId: string,
    roadPoints: string[]
}

export type transfer = {
    companyId: string,
    locations: {
        [key: string]: {
            label: string,
            description: string
        }
    }
}


export type booking = {
    zaloId: string;             // ID người dùng Zalo
    zaloName: string;           // Tên người dùng Zalo

    companyId: string
    companyName: string
    typeBus: string
    routeId: string;            // ID tuyến, ví dụ: 'hanoi-sapa-01'
    fromTo: string;

    nameBooking: string;        // Họ tên người đặt
    phoneBooking: string;       // SĐT người đặt
    numBooking: number;         // Số lượng hành khách (nên dùng number, không nên string)


    dateBooking: Date | undefined | string;        // Ngày đi, định dạng ISO: '2025-08-01'

    timePickBooking: Date | undefined | string;        // Giờ khởi hành, ví dụ: '07:30' hoặc '2025-08-01T07:30'
    timeDropBooking: Date | undefined | string;

    pickUpAddress: string
    dropOffAddress: string

    isReturn: boolean                             // khứ hồi mặc định false
    dateReturn: Date | undefined | string

    pickUpAddressReturn: string
    dropOffAddressReturn: string

    createdAt: Date;         // (Tùy chọn) Ngày giờ tạo - dùng khi cần thống kê
    isDeleted: boolean
};




export type ticket = {
    id: string
    zaloId: string
    zaloName: string

    companyName: string,

    fromTo: string,

    dateBooking: Date | string | undefined,


    isReturn: boolean                             // khứ hồi mặc định false
    dateReturn: Date | undefined | string
    dropOffAddressReturn: string
    pickUpAddressReturn: string
    status: "unused" | "used" | "canceled",

    //detailsTicket
    nameBooking: string,
    phoneBooking: string,
    seatName: string[],                   //A3
    totalPrice: number,                  //500000
    numBooking: number                 //2 people
    busNumber: string                //79A-2239.31

    timePickBooking: Date | undefined | string,
    timeDropBooking: Date | undefined | string,

    pickUpAddress: string
    dropOffAddress: string



    //Hide/Show details
    adminConfirm: boolean

    createdAt: Date;
}


export type token = {
    id: "access_permision"
    access_token: string
    refresh_token: string
    expires_in: number
    createAt: Date
}

