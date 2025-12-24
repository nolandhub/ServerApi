'use client'
import { DetailScheduleTable } from "@/components/table/table-detail-schedule/table-detail-schedule"
import { DetailScheduleSchema } from "@/config/datafield/detailScheduleSchema"
import z from "zod"

export default function Page() {
    const data: z.infer<typeof DetailScheduleSchema>[] = [
        {
            "stt": 1,
            "tripId": 7,
            "routeId": 2,
            "compId": 1,
            "routeName": "Nha Trang - Sài Gòn",
            "busName": "Limousine 34 Giường ",
            "compName": "AN ANH LIMOUSINE",
            "priceTypeName": "Theo giường",
            "instanceDate": "2026-01-03T17:00:00.000Z",
            "isActive": 1,
            "priceDetails": [
                {
                    "time": "12:00",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 649999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1008,
                            "basePrice": 250000
                        }
                    ]
                },
                {
                    "time": "13:00",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 749999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1015,
                            "basePrice": 250000
                        }
                    ]
                },
                {
                    "time": "17:00",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 949999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1022,
                            "basePrice": 250000
                        }
                    ]
                },
                {
                    "time": "21:00",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 1249999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1029,
                            "basePrice": 250000
                        }
                    ]
                },
                {
                    "time": "22:30",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 309999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1036,
                            "basePrice": 250000
                        }
                    ]
                },
                {
                    "time": "23:00",
                    "detail": [
                        {
                            "label": "Giường Đơn",
                            "adjustedPrice": 309999,
                            "seatTypeId": 1,
                            "priceInstanceId": 1071,
                            "basePrice": 250000
                        }
                    ]
                }
            ],
            "priceRules": [
                {
                    "value": 30000,
                    "ruleId": 21,
                    "weekdays": 30,
                    "adjustType": "amount",
                    "timeRangeEnd": "12:00",
                    "timeRangeStart": "12:00"
                },
                {
                    "value": 50000,
                    "ruleId": 22,
                    "weekdays": 30,
                    "adjustType": "amount",
                    "timeRangeEnd": "13:00",
                    "timeRangeStart": "13:00"
                },
                {
                    "value": 120000,
                    "ruleId": 23,
                    "weekdays": 30,
                    "adjustType": "amount",
                    "timeRangeEnd": "17:00",
                    "timeRangeStart": "17:00"
                },
                {
                    "value": 22000,
                    "ruleId": 24,
                    "weekdays": 30,
                    "adjustType": "amount",
                    "timeRangeEnd": "21:00",
                    "timeRangeStart": "21:00"
                },
                {
                    "value": 399999,
                    "ruleId": 25,
                    "weekdays": 97,
                    "adjustType": "amount",
                    "timeRangeEnd": "12:00",
                    "timeRangeStart": "12:00"
                },
                {
                    "value": 499999,
                    "ruleId": 26,
                    "weekdays": 97,
                    "adjustType": "amount",
                    "timeRangeEnd": "13:00",
                    "timeRangeStart": "13:00"
                },
                {
                    "value": 699999,
                    "ruleId": 27,
                    "weekdays": 97,
                    "adjustType": "amount",
                    "timeRangeEnd": "17:00",
                    "timeRangeStart": "17:00"
                },
                {
                    "value": 999999,
                    "ruleId": 28,
                    "weekdays": 97,
                    "adjustType": "amount",
                    "timeRangeEnd": "21:00",
                    "timeRangeStart": "21:00"
                },
                {
                    "value": 59999,
                    "ruleId": 29,
                    "weekdays": 97,
                    "adjustType": "amount",
                    "timeRangeEnd": "23:04",
                    "timeRangeStart": "22:00"
                }
            ],
            "sales":
            {
                "value": -35000,
                "saleId": 3,
                "scopeId": 2,
                "saleName": "sale cho route",
                "saleType": "amount",
                "weekdays": 24,
                "endDate": "2025-12-30",
                "startDate": "2025-11-01",
                "timeRangeEnd": null,
                "timeRangeStart": null
            }
        }
    ]
    return (
        <div className="p-6">
            <DetailScheduleTable data={data} />
        </div>
    )
}