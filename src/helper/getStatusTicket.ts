export const getStatusColor = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
        confirmed: { color: "bg-green-500", label: "Xác nhận" },
        pending: { color: "bg-yellow-500", label: "Chờ xác nhận" },
        cancelled: { color: "bg-red-500", label: "Đã hủy" },
        used: { color: "bg-blue-500", label: "Hoàn thành" }
    };
    const config = statusMap[status]
    return config
}