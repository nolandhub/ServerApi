import axios from "axios";

export default function formatErr(err: unknown) {
    if (axios.isAxiosError(err)) return err.response?.data ?? err.message;
    if (err instanceof Error) return err.message;
    return "Unknown error";
}