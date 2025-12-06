/**
 * Lưu thứ tự (order) vào localStorage
 */
export function saveOrderToLocalStorage(key: string, data: any[]): void {
    try {
        const orderData = data.map((item, index) => ({
            id: item.id,
            orderIndex: index,
        }))
        localStorage.setItem(key, JSON.stringify(orderData))
    } catch (error) {
        console.error("❌ Error saving order to localStorage:", error)
    }
}

/**
 * Lấy thứ tự từ localStorage
 */
export function getOrderFromLocalStorage(key: string): Record<string, number> | null {
    try {
        const stored = localStorage.getItem(key)
        if (!stored) return null

        const orderData = JSON.parse(stored) as Array<{ id: string | number; orderIndex: number }>
        const orderMap = Object.fromEntries(
            orderData.map(item => [item.id.toString(), item.orderIndex])
        )
        return orderMap
    } catch (error) {
        console.error("❌ Error reading order from localStorage:", error)
        return null
    }
}

/**
 * Sắp xếp data theo thứ tự từ localStorage
 */
export function sortByLocalStorageOrder<T extends { id: string | number }>(
    data: T[],
    key: string
): T[] {
    const orderMap = getOrderFromLocalStorage(key)
    if (!orderMap) return data

    return [...data].sort((a, b) => {
        const orderA = orderMap[a.id.toString()] ?? Infinity
        const orderB = orderMap[b.id.toString()] ?? Infinity
        return orderA - orderB
    })
}
