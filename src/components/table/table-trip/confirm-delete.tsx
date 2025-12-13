import axios from "axios";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { toast } from "sonner";
import { useTripStore } from "@/store/tripStore";

interface PropConfirmDelete {
    id: number;
    openDialog: boolean;
    closeDialog: () => void;
}

const ConfirmDelete = ({ id, openDialog, closeDialog }: PropConfirmDelete) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const res = await axios.delete(`/api/trips/${id}`);

            if (!res.data.success) {
                toast.error(res.data.message);
                closeDialog();
                return;
            }

            toast.success(res.data.message);
            useTripStore.getState().removeTrip(id);
            closeDialog();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.message ||
                "Lỗi khi xóa chuyến";
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog
            open={openDialog}
            onOpenChange={(open) => {
                if (!open) closeDialog()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa chuyến</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa chuyến này không? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            Hủy
                        </Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Đang xóa..." : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;