import axios from "axios";

export const getDropdownData = async (type: "routes" | "companies" | "transfer-types" | "price-types") => {
    const res = await axios.get(`/api/${type}`);
    return res.data;
};

export function buildZaloPayload({
    userId,
    customerName,
    route,
    status
}: {
    userId: string
    customerName: string
    route: string
    status: string
}) {
    return {
        recipient: {
            user_id: userId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "transaction_order",
                    language: "VI",
                    elements: [
                        {
                            type: "header",
                            content: "Tiếp nhận vé đặt",
                            align: "left"
                        },
                        {
                            type: "text",
                            align: "left",
                            content:
                                "• Cảm ơn bạn đã đặt vé ở Mini App ProbusVN Vé Xe Limousine."
                        },
                        {
                            type: "table",
                            content: [
                                {
                                    key: "Tên khách hàng",
                                    value: customerName
                                },
                                {
                                    key: "Tuyến",
                                    value: route
                                },
                                {
                                    key: "Trạng thái",
                                    value: status,
                                    style: status === "Đặt thành công" ? "green" : "red"
                                }
                            ]
                        },
                        {
                            type: "text",
                            align: "center",
                            content: "📱Lưu ý điện thoại. Xin cảm ơn!"
                        }
                    ],
                    buttons: [
                        {
                            title: "Xem vé của tôi",
                            type: "oa.open.url",
                            payload: {
                                url: "https://h5.zdn.vn/zapps/2545632599638931496/tickets"
                            }
                        },
                        {
                            title: "Liên hệ tổng đài",
                            image_icon:
                                "https://th.bing.com/th/id/R.6e19540757907e6cac985b506fbd4908",
                            type: "oa.open.phone",
                            payload: {
                                phone_code: "84123456789"
                            }
                        }
                    ]
                }
            }
        }
    }
}

interface Option {
    label: string
    quantity: number
    subtotal: number
    time: string
}

function safeZaloContent(content: string, max = 250) {
    return content
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)
}

function buildOptionContent(options: Option[]) {
    return options
        .map(o => `• x${o.quantity} ${o.label}: ${formatVnd(o.subtotal)}`)
        .join("<br>")
}

export function formatVnd(amount: number) {
    return amount.toLocaleString("vi-VN") + "đ"
}
export function buildZaloConfirm({
    userId,
    customerName,
    route,
    busName,
    departDate,
    totalPassCount,
    option,
    total
}: {
    userId: string
    customerName: string
    busName: string
    route: string
    departDate: string
    totalPassCount: number
    option: Option[]
    total: number
}) {

    const rawContent =
        "• Cảm ơn bạn đã đặt vé tại ProbusVN.<br>" +
        "• Thông tin vé của bạn như sau:<br>" +
        `• Số lượng: ${totalPassCount}<br>` +
        buildOptionContent(option)

    return {
        recipient: {
            user_id: userId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "transaction_order",
                    language: "VI",
                    elements: [
                        {
                            type: "banner",
                            image_url:
                                "https://serverapi-pi.vercel.app/Probus/bg-hero.webp"
                        },
                        {
                            type: "header",
                            content: "Xác nhận đặt vé",
                            align: "left"
                        },
                        {
                            type: "text",
                            align: "left",
                            content: safeZaloContent(rawContent)
                        },
                        {
                            type: "table",
                            content: [
                                {
                                    key: "Tên khách hàng",
                                    value: customerName
                                },
                                {
                                    key: "Tuyến",
                                    value: route
                                },
                                {
                                    "value": `${busName}`,
                                    "key": "Xe"
                                },
                                {
                                    "value": `${departDate} - ${option[0].time}`,
                                    "key": "Ngày đi"
                                },
                                {
                                    key: "Tổng thanh toán",
                                    value: formatVnd(total)
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            title: "Xem vé của tôi",
                            type: "oa.open.url",
                            payload: {
                                url: "https://h5.zdn.vn/zapps/2545632599638931496/tickets"
                            }
                        },
                        {
                            title: "Liên hệ tổng đài",
                            image_icon:
                                "https://th.bing.com/th/id/R.6e19540757907e6cac985b506fbd4908",
                            type: "oa.open.phone",
                            payload: {
                                phone_code: "84123456789"
                            }
                        }
                    ]
                }
            }
        }
    }
}
