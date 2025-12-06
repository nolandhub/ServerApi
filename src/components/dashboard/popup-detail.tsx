import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Ticket } from '@/helper/ticketTableHelper'
import { Armchair, Bus, CalendarDaysIcon, Clock, MapPin, Plus, TicketIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import dayjs from 'dayjs'

const PopoverDetailBooking = ({ data }: { data: Ticket }) => {
    const getStatusColor = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            confirmed: { color: "bg-green-500", label: "Xác nhận" },
            pending: { color: "bg-yellow-500", label: "Chờ xác nhận" },
            cancelled: { color: "bg-red-500", label: "Đã hủy" },
            used: { color: "bg-blue-500", label: "Hoàn thành" }
        };
        const config = statusMap[status]
        return config
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' VNĐ'
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' size='icon' className='rounded-full h-8 w-8'>
                    <Plus className='h-4 w-4' />
                </Button>
            </PopoverTrigger>

            <PopoverContent className='w-96 max-h-[80vh] overflow-y-auto' align="start" sideOffset={4}>
                <div className='space-y-2'>
                    {/* Header */}
                    <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-2'>

                            <CalendarDaysIcon className='h-5 w-5 text-primary flex-shrink-0' />
                            <p>Ngày đi: </p>
                            <h3 className='font-bold text-lg'>{dayjs(data.bookingDate).format("DD-MM-YYYY")}</h3>
                        </div>
                        <Badge className={`${getStatusColor(data.status).color} text-white flex-shrink-0`}>
                            {getStatusColor(data.status).label}
                        </Badge>
                    </div>

                    {/* Cancel Reason - moved here */}
                    {data.cancelReason && (
                        <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                            <p className='text-xs font-semibold text-red-800 mb-1'>Lý do hủy:</p>
                            <p className='text-xs text-red-700'>{data.cancelReason}</p>
                        </div>
                    )}

                    <Separator />

                    {/* Trip Info */}
                    <div className='space-y-3'>
                        <div className='flex gap-2'>
                            <Bus className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>{data.routeName}</p>
                                <p className='text-xs text-muted-foreground'>{data.compName} - {data.busName}</p>
                                {data.busNumber && (
                                    <p className='text-xs text-muted-foreground'>Biển số: {data.busNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Pick up */}
                        <div className='flex gap-2'>
                            <MapPin className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>{data.pickUp.title}</p>
                                {data.pickUp.subtitle && (
                                    <p className='text-xs text-muted-foreground'>{data.pickUp.subtitle}</p>
                                )}
                            </div>
                        </div>

                        {/* Drop off */}
                        <div className='flex gap-2'>
                            <MapPin className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>{data.dropOff.title}</p>
                                {data.dropOff.subtitle && (
                                    <p className='text-xs text-muted-foreground'>{data.dropOff.subtitle}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Seats */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <h4 className='text-sm font-semibold text-muted-foreground'>CHI TIẾT GIÁ</h4>
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Armchair className='h-3 w-3' />
                                <span>{data.totalPassCount} ghế</span>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            {data.option.map((opt, idx) => (
                                <div key={idx} className='flex items-center justify-between p-2 bg-muted/50 rounded-md'>
                                    <div className='flex items-center gap-2'>
                                        <Clock className='h-3 w-3 text-muted-foreground' />
                                        <div>
                                            <p className='text-sm font-medium'>{opt.label}</p>
                                            <p className='text-xs text-muted-foreground'>{opt.time}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm font-medium'>{formatCurrency(opt.subtotal)}</p>
                                        <p className='text-xs text-muted-foreground'>x{opt.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <div className='flex items-center justify-end space-x-1.5 bg-muted/50 rounded-md'>
                                <p className='font-semibold'>Tổng tiền:</p>
                                <p className='text-lg font-bold text-blue-700'>{formatCurrency(data.total)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='text-xs text-muted-foreground space-y-1'>
                        <p>Mã vé: {data.id}</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverDetailBooking
