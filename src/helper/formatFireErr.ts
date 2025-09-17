import { FirebaseError } from "firebase/app";

export default function fireErrFormat(err: unknown): string | object {
    if (err instanceof FirebaseError) {
        // Lỗi Firestore / Firebase
        return {
            code: err.code,        // ví dụ: "permission-denied"
            message: err.message   // thông tin chi tiết
        };
    }

    if (err instanceof Error) {
        // Lỗi JS bình thường
        return err.message;
    }

    // Lỗi không xác định
    return "Unknown error";
}
