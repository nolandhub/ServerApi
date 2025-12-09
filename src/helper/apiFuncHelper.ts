import axios from "axios";

export const getDropdownData = async (type: "routes" | "companies" | "transfer-types" | "price-types") => {
    const res = await axios.get(`/api/${type}`);
    return res.data;
};