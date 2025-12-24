import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

import { Option } from '@/types/Firestore_Type';
import { mergeTicket } from '@/firebase/firestore/ticketFunc';
import { Ticket } from '@/helper/ticketTableHelper';
import { Calendar22 } from '../common/date-picker';
import axios from 'axios';
import { toast } from "sonner"


const TICKET_STATUS = [
    { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-500' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-green-500' },
    { value: 'used', label: 'Đã sử dụng', color: 'bg-blue-500' },
    { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-500' }
];

export type TicketUpdate = Pick<
    Ticket,
    | 'bookingName'
    | 'bookingPhone'
    | 'routeName'
    | 'busNumber'
    | 'seatName'
    | 'bookingDate'
    | 'pickUp'
    | 'dropOff'
    | 'option'
    | 'total'
    | 'totalPassCount'
    | 'status'
>;

export function TicketQuickEditDrawer({ item }: { item: Ticket }) {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState<Ticket>(item);

    useEffect(() => {
        if (open) {
            setFormData(item)
        }
    }, [open, item])

    const handleSubmit = async () => {
        if (!formData.id) return;

        const payload: TicketUpdate = {
            bookingName: formData.bookingName,
            bookingPhone: formData.bookingPhone,
            routeName: formData.routeName,
            busNumber: formData.busNumber,
            seatName: formData.seatName,
            bookingDate: new Date(formData.bookingDate).toISOString(),
            pickUp: formData.pickUp,
            dropOff: formData.dropOff,
            option: formData.option,
            total: formData.total,
            totalPassCount: formData.totalPassCount,
            status: formData.status,
        };

        const zaloPayload = {
            userId: formData.zaloId,                 // hoặc lấy từ ticket
            customerName: formData.bookingName,
            route: formData.routeName,
            busName: formData.busName,
            departDate: formData.bookingDate,         // string, không cần ISO
            totalPassCount: formData.totalPassCount,
            option: formData.option,                  // array Option
            total: formData.total                     // number
        }

        if (payload.status === "confirmed") {
            try {
                await axios.post("/api/zalo-send-confirm", zaloPayload)
            } catch (err) {
                console.error("Zalo confirm failed", err)
                // KHÔNG throw để tránh rollback nghiệp vụ
            }
        }

        await mergeTicket(formData.id, payload);


        setShowConfirm(false);
        setOpen(false);
        toast.success("Cập nhật thành công")

    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = <P extends keyof Ticket, F extends string>(
        parent: P,
        field: F,
        value: any
    ) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(typeof prev[parent] === 'object' && prev[parent] !== null
                    ? prev[parent]
                    : {}),
                [field]: value,
            },
        }));
    };

    const handleOptionChange = <K extends keyof Option>(
        index: number,
        field: K,
        value: Option[K]
    ) => {
        setFormData((prev) => {
            if (!prev.option) return prev;
            if (!prev.option[index]) return prev;

            const options = [...prev.option];
            const current = options[index];

            const updated: Option = {
                ...current,
                [field]: value,
            };

            if (field === 'quantity' || field === 'value') {
                const quantity = field === 'quantity' ? Number(value) : current.quantity;
                const price = field === 'value' ? Number(value) : current.value;
                updated.subtotal = quantity * price;
            }

            options[index] = updated;

            // Tính tổng tiền và tổng số khách
            const total = options.reduce((sum, opt) => sum + (opt.subtotal || 0), 0);
            const totalPassCount = options.reduce((sum, opt) => sum + (opt.quantity || 0), 0);

            return {
                ...prev,
                option: options,
                total,
                totalPassCount,
            };
        });
    };

    const getStatusInfo = (status: string) => {
        return TICKET_STATUS.find(s => s.value === status) || TICKET_STATUS[0];
    };

    return (
        <>
            <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="link" className="text-foreground w-fit px-0 text-left h-auto">
                        {item?.bookingName || 'Xem chi tiết'}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className={isMobile ? "max-h-[90vh]" : "h-screen w-full sm:max-w-xl"}>
                    <DrawerHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Chỉnh sửa</DrawerTitle>
                            <Badge className={`${getStatusInfo(formData.status).color} text-white`}>
                                {getStatusInfo(formData.status).label}
                            </Badge>
                        </div>
                    </DrawerHeader>

                    <div className="overflow-y-auto p-6 space-y-6">
                        {/* Trạng thái */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Trạng thái</h3>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange('status', value as Ticket['status'])}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TICKET_STATUS.map(status => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Khách hàng */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Khách hàng</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs">Họ tên</Label>
                                    <Input
                                        value={formData.bookingName}
                                        onChange={(e) => handleChange('bookingName', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Điện thoại</Label>
                                    <Input
                                        value={formData.bookingPhone}
                                        onChange={(e) => handleChange('bookingPhone', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Chuyến xe */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Chuyến xe</h3>
                            <div>
                                <Label className="text-xs">Tuyến</Label>
                                <Input
                                    value={formData.routeName}
                                    onChange={(e) => handleChange('routeName', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='flex flex-col gap-2'>
                                    <Label className="text-xs">Ngày đi</Label>
                                    <Calendar22 onSelect={(date) => handleChange("bookingDate", date)} date={formData.bookingDate ? new Date(formData.bookingDate) : undefined} />
                                </div>
                                <div>
                                    <Label className="text-xs">Biển số</Label>
                                    <Input
                                        value={formData.busNumber || ''}
                                        onChange={(e) => handleChange('busNumber', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Ghế</Label>
                                    <Input
                                        value={formData.seatName}
                                        onChange={(e) => handleChange('seatName', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Điểm đón/trả */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Điểm đón & trả</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-green-600">Điểm đón</Label>
                                    <Input
                                        value={formData.pickUp?.title}
                                        onChange={(e) => handleNestedChange('pickUp', 'title', e.target.value)}
                                        placeholder="Địa điểm"
                                    />
                                    <Input
                                        value={formData.pickUp?.subtitle || ''}
                                        onChange={(e) => handleNestedChange('pickUp', 'subtitle', e.target.value)}
                                        placeholder="Chi tiết"
                                        className="text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-red-600">Điểm trả</Label>
                                    <Input
                                        value={formData.dropOff?.title}
                                        onChange={(e) => handleNestedChange('dropOff', 'title', e.target.value)}
                                        placeholder="Địa điểm"
                                    />
                                    <Input
                                        value={formData.dropOff?.subtitle || ''}
                                        onChange={(e) => handleNestedChange('dropOff', 'subtitle', e.target.value)}
                                        placeholder="Chi tiết"
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Chi tiết vé */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Chi tiết vé</h3>
                            {formData.option?.map((op, index) => (
                                <div key={index} className="border rounded p-3 space-y-2 bg-muted/30">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            value={op.time}
                                            onChange={(e) => handleOptionChange(index, 'time', e.target.value)}
                                            placeholder="Giờ"
                                            className="h-9"
                                        />
                                        <Input
                                            value={op.label}
                                            onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                            placeholder="Loại"
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            type="number"
                                            value={op.value}
                                            onChange={(e) => handleOptionChange(index, 'value', Number(e.target.value))}
                                            placeholder="Giá"
                                            className="h-9"
                                        />
                                        <Input
                                            type="number"
                                            value={op.quantity}
                                            onChange={(e) => handleOptionChange(index, 'quantity', Number(e.target.value))}
                                            placeholder="SL"
                                            className="h-9"
                                        />
                                        <Input
                                            disabled
                                            value={op.subtotal.toLocaleString()}
                                            className="h-9 bg-background"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Thanh toán */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Thanh toán</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs">Số khách</Label>
                                    <Input
                                        type="number"
                                        value={formData.totalPassCount}
                                        disabled
                                        className="mt-1 bg-muted"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Tổng tiền</Label>
                                    <Input
                                        type="number"
                                        value={formData.total}
                                        disabled
                                        className="mt-1 font-semibold bg-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Info */}
                        <div className="text-xs text-muted-foreground pt-2">
                            Người tạo: <span className="font-medium">{formData.createUser}</span>
                        </div>

                    </div>

                    <DrawerFooter className="border-t">
                        <div className="flex gap-2">
                            <Button onClick={() => setShowConfirm(true)} className="flex-1">
                                Lưu
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="flex-1">
                                    Đóng
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn lưu những thay đổi này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                Hủy
                            </Button>
                        </DialogClose>

                        <DialogTrigger asChild>
                            <Button onClick={handleSubmit}>
                                Xác nhận
                            </Button>
                        </DialogTrigger>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}