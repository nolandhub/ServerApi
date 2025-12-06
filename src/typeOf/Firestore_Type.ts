"use client"
import { Timestamp } from "firebase/firestore"
import { basePickDrop } from "./rawType"
//User INFO
export interface CoreData {
    name: string
    avatar: string
    phone: string
    role: string
    totalSpending: number
    createAt: Timestamp
}

export interface User extends CoreData {
    id: string
}

// Dữ liệu cá nhân chỉ lưu ở local
export type UserCached = CoreData & {
    gender?: string
    dob?: string
    address?: string
    favorite?: string
}

export interface Option {
    time: string;           // "08:00 - 10:00"
    label: string;          // "Phòng VIP"
    value: number;          // 600000
    quantity: number;       // 2
    subtotal: number;       // 1200000
}

export interface BookingData {
    bookingId: string
    zaloId: string

    compId: string
    compName: string
    busName: string
    tripId: number
    routeName: string

    bookingDate: string

    //Scale --> future
    // isReturn: boolean
    // returnDate?: Date | null

    bookingName: string
    bookingPhone: string

    option: Option[]
    total: number   //total price
    totalPassCount: number  //total quantities of passenger

    pickUp: basePickDrop | null            //Time here - PickUp
    dropOff: basePickDrop | null       //Time here - DropOff

    pickUpNote: string | ""
    dropOffNote: string | ""

    createAt?: string
    updateAt?: Timestamp

    isDelete: boolean
}

export type TicketStatus = "pending" | "confirmed" | "used" | "cancelled"

export interface Ticket extends BookingData {
    id: string
    busNumber: string
    seatName: string
    status: TicketStatus
    cancelReason: string
    createUser: string
    updateUser?: string
}


export interface Policies {
    title: string
    description: string[]
}

export interface BusCompanyData {
    compId: string
    compName: string
    avatar: string
    imagesInterior: string[]
    policies: Policies[]
    updateAt?: Date
}

export interface BusCompany extends BusCompanyData {
    id: string
}



export type token = {
    id: "access_permision"
    access_token: string
    refresh_token: string
    expires_in: number
    createAt: Date
}

