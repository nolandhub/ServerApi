"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { Trip, useTripStore } from '@/store/tripStore'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select'
import { getDropdownData } from '@/helper/apiFuncHelper'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'

interface SheetProps {
    openSheet: boolean;
    closeSheet: () => void;
    trip: Trip | null;
}

const emptyForm: FormEdit = {
    id: null,
    routeId: null,
    compId: null,
    busName: '',
    transferTypeId: null,
    priceTypeId: null,
}

interface FormEdit {
    id?: number | null
    routeId: number | null;
    compId: number | null;
    busName: string;
    transferTypeId: number | null;
    priceTypeId: number | null;
}

export const SheetEdit = ({ openSheet, closeSheet, trip }: SheetProps) => {
    const [routes, setRoutes] = useState<{ id: number, routeName: string }[]>([])
    const [companies, setCompanies] = useState<{ id: number, compName: string }[]>([])
    const [showConfirm, setShowConfirm] = useState(false)

    const [formEdit, setFormEdit] = useState<FormEdit>({
        id: trip?.id,
        routeId: trip?.routeId || null,
        compId: trip?.compId || null,
        busName: trip?.busName || '',
        transferTypeId: trip?.transferTypeId || null,
        priceTypeId: trip?.priceTypeId || null,
    })

    useEffect(() => {
        if (trip && trip.id != null) {
            setFormEdit({
                id: trip.id,
                routeId: trip.routeId,
                compId: trip.compId,
                busName: trip.busName || '',
                transferTypeId: trip.transferTypeId,
                priceTypeId: trip.priceTypeId,
            })
        } else {
            setFormEdit({
                id: null,
                routeId: null,
                compId: null,
                busName: '',
                transferTypeId: null,
                priceTypeId: null,
            })
        }
    }, [trip])

    useEffect(() => {
        getDropdownData("routes").then(setRoutes)
        getDropdownData("companies").then(setCompanies)
    }, [])

    const handleChange = (field: keyof FormEdit, value: any) => {
        setFormEdit(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        const { routeId, compId, busName, transferTypeId, priceTypeId } = formEdit

        if (!routeId || !compId || !busName || !transferTypeId || !priceTypeId) {
            toast.warning("Vui lòng điền đầy đủ thông tin!")
            return
        }

        try {
            const res = await axios.post("/api/trips/upsert", formEdit)
            if (!res.data.success) {
                toast.error("Cập nhật thất bại")
                closeSheet()
            }
            useTripStore.getState().upsertTrip(res.data.data)
            toast.success("Cập nhật thành công")
            closeSheet()
        } catch (err) {
            console.error(err)
            alert("Có lỗi xảy ra khi lưu dữ liệu")
        }
    }

    const isEditMode = !!trip;

    return (
        <div>
            <Sheet
                open={openSheet}
                onOpenChange={(open) => {
                    if (!open) {
                        if (!isEditMode) setFormEdit(emptyForm)
                        closeSheet()
                    }
                }}
            >
                <SheetContent className='p-4' side='bottom'>
                    <SheetHeader>
                        <SheetTitle>{isEditMode ? "Cập nhật chuyến" : "Thêm mới chuyến"}</SheetTitle>
                        <SheetDescription>
                            {isEditMode
                                ? "Chỉnh sửa các trường thông tin và xác nhận để cập nhật"
                                : "Điền các trường thông tin và xác nhận để lưu"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className='grid flex-1 auto-rows-min gap-6 px-4'>
                        {/* Tuyến đường */}
                        <div className="grid gap-3">
                            <Label>Tuyến đường</Label>
                            <Select
                                value={formEdit.routeId?.toString() || ''}
                                onValueChange={(val) => handleChange('routeId', Number(val))}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder={"Chọn tuyến đường"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn tuyến đường</SelectLabel>
                                        {routes.map(r =>
                                            <SelectItem key={r.id} value={String(r.id)}>{r.routeName}</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Nhà xe */}
                        <div className="grid gap-3">
                            <Label>Nhà xe</Label>
                            <Select
                                value={formEdit.compId?.toString() || ''}
                                onValueChange={(val) => handleChange('compId', Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={"Chọn nhà xe"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn nhà xe</SelectLabel>
                                        {companies.map(c =>
                                            <SelectItem key={c.id} value={String(c.id)}>{c.compName}</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tên xe */}
                        <div className="grid gap-3">
                            <Label htmlFor="bus-name">Tên xe</Label>
                            <Input
                                id="bus-name"
                                value={formEdit.busName}
                                onChange={(e) => handleChange('busName', e.target.value)}
                            />
                        </div>

                        {/* Chiều trung chuyển */}
                        <div className="grid gap-3">
                            <Label>Chiều trung chuyển</Label>
                            <Select
                                value={formEdit.transferTypeId?.toString() || ''}
                                onValueChange={(val) => handleChange('transferTypeId', Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={"Chọn chiều trung chuyển"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn chiều trung chuyển</SelectLabel>
                                        <SelectItem value="1">Chiều đi</SelectItem>
                                        <SelectItem value="2">Chiều đến</SelectItem>
                                        <SelectItem value="3">2 Chiều</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Loại giá */}
                        <div className="grid gap-3">
                            <Label>Loại giá</Label>
                            <Select
                                value={formEdit.priceTypeId?.toString() || ''}
                                onValueChange={(val) => handleChange('priceTypeId', Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={"Chọn loại giá"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn loại giá</SelectLabel>
                                        <SelectItem value="1">Giá cố định</SelectItem>
                                        <SelectItem value="2">Giá theo giường</SelectItem>
                                        <SelectItem value="3">Giá theo hàng</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type='button' onClick={() => setShowConfirm(true)}>Xác nhận</Button>
                        <SheetClose asChild>
                            <Button onClick={closeSheet} variant='outline'>Đóng</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận thay đổi</DialogTitle>
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
        </div>
    )
}

export default SheetEdit
