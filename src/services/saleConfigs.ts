import axios from "axios";

export async function getAllSaleConfigs() {
    try {
        const res = await axios.get("/api/sale-configs")
        return res.data

    } catch (error) {
        console.error(error)
    }
}