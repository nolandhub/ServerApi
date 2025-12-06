
const WEEKDAY_BITMASK = [
    { bit: 1, label: "CN", color: "bg-red-500 text-white" },
    { bit: 2, label: "T2", color: "bg-orange-500 text-white" },
    { bit: 4, label: "T3", color: "bg-amber-500 text-black" },
    { bit: 8, label: "T4", color: "bg-emerald-500 text-white" },
    { bit: 16, label: "T5", color: "bg-cyan-500 text-black" },
    { bit: 32, label: "T6", color: "bg-blue-500 text-white" },
    { bit: 64, label: "T7", color: "bg-violet-500 text-white" }

];

export const decodeWeekdays = (value: number) => {
    if (value === 127) {
        return [{ bit: 127, label: "Tất cả", color: "bg-black text-white" }]
    }
    return WEEKDAY_BITMASK.filter(day => (value & day.bit) !== 0)
}


