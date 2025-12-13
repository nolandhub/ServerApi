"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

import { format } from 'date-fns';
import { LucideCalendar, LucideInfo } from 'lucide-react';
import { Calendar22 } from '@/components/common/date-picker';
import { useMemo, useState } from 'react';

// Mock types
type Trip = {
    id: number;
    routeName: string;
    companyName: string;
    busName: string;
    basePrice: number;
    priceType: string;
};

type PricingRule = { week_day: number; price_adjustment: number; multiplier: number };

type Sale = { id: number; code: string; name: string; type: 'percent' | 'fixed'; value: number };

const mockTrips: Trip[] = [
    { id: 1, routeName: 'Đà Nẵng - Hà Nội', companyName: 'Phương Trang', busName: 'F01', basePrice: 400000, priceType: 'Tiêu chuẩn' },
    { id: 2, routeName: 'Đà Nẵng - Hội An', companyName: 'LocalBus', busName: 'L02', basePrice: 150000, priceType: 'Express' },
];

const mockRules: Record<number, PricingRule[]> = {
    1: [{ week_day: 2, price_adjustment: 30000, multiplier: 1 }, { week_day: 4, price_adjustment: 40000, multiplier: 1 }],
    2: [{ week_day: 7, price_adjustment: 50000, multiplier: 1 }]
};

const mockSales: Record<number, Sale | null> = {
    1: { id: 10, code: 'SALE10', name: 'Black Friday', type: 'percent', value: 10 },
    2: null
};

export default function PricingAdmin() {
    const [pickedDate, setPickedDate] = useState<Date | undefined>(new Date());
    const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const weekday = useMemo(() => {
        if (!pickedDate) return null;
        const js = pickedDate.getDay();
        return js === 0 ? 7 : js; // JS: 0=Sun..6=Sat → 1=Mon..7=Sun
    }, [pickedDate]);

    function openDetails(tripId: number) {
        setSelectedTripId(tripId);
        setDrawerOpen(true);
    }

    function computeFinalPrice(trip: Trip) {
        const rules = mockRules[trip.id] || [];
        const ruleForDay = rules.find(r => r.week_day === weekday);
        const sale = mockSales[trip.id] || null;

        let price = trip.basePrice;
        if (ruleForDay) {
            if (ruleForDay.multiplier && ruleForDay.multiplier !== 1) price = price * ruleForDay.multiplier;
            price = price + (ruleForDay.price_adjustment || 0);
        }

        if (sale) {
            if (sale.type === 'percent') price = price * (1 - sale.value / 100);
            else price = price - sale.value;
        }

        return Math.round(price);
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <LucideCalendar /> Quản lý giá vé
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Calendar22 date={pickedDate} onSelect={(date) => setPickedDate(date)} />
                        <Select onValueChange={(v) => console.log('filter', v)}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Lọc theo tuyến / công ty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="company:1">Phương Trang</SelectItem>
                                <SelectItem value="company:2">LocalBus</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => alert('Áp dụng bộ lọc')}>Áp dụng</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">Ngày đã chọn: {pickedDate ? format(pickedDate, 'yyyy-MM-dd (EEEE)') : '—'}</div>

                    <div className="mt-4 overflow-x-auto">
                        <Table className="min-w-[900px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>STT</TableHead>
                                    <TableHead>Tuyến</TableHead>
                                    <TableHead>Công ty</TableHead>
                                    <TableHead>Xe</TableHead>
                                    <TableHead>Khuyến mãi</TableHead>
                                    <TableHead>Điều chỉnh giá</TableHead>
                                    <TableHead>Giá cuối</TableHead>
                                    <TableHead>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTrips.map((t, index) => (
                                    <TableRow key={t.id} className="hover:bg-gray-100">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{t.routeName}</TableCell>
                                        <TableCell>{t.companyName}</TableCell>
                                        <TableCell>{t.busName}</TableCell>
                                        <TableCell>
                                            {mockSales[t.id]
                                                ? `${mockSales[t.id]!.name} (${mockSales[t.id]!.type === 'percent' ? mockSales[t.id]!.value + '%' : mockSales[t.id]!.value + 'đ'})`
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {(mockRules[t.id] || []).length ? (
                                                <div className="text-sm space-y-1">
                                                    {(mockRules[t.id] || []).map(r => (
                                                        <div key={r.week_day}>
                                                            Thứ {r.week_day}: {r.price_adjustment ? `+${r.price_adjustment}đ` : ''}{r.multiplier && r.multiplier !== 1 ? ` x${r.multiplier}` : ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : 'Mặc định'}
                                        </TableCell>
                                        <TableCell>{Intl.NumberFormat('vi-VN').format(computeFinalPrice(t))}đ</TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="outline" onClick={() => openDetails(t.id)}>Xem chi tiết</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Drawer chi tiết trip */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Chi tiết giá vé</DrawerTitle>
                    </DrawerHeader>
                    <div className="space-y-4 p-4">
                        {selectedTripId ? (
                            <>
                                {/* Thông tin tổng quan */}
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Chuyến #{selectedTripId}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                        <div>
                                            <div className="text-gray-500">Loại giá</div>
                                            <div>Tiêu chuẩn</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Loại chuyến</div>
                                            <div>Chuyến thẳng</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Bảng điều chỉnh theo ngày trong tuần */}
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Điều chỉnh theo ngày trong tuần</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Thứ</TableHead>
                                                    <TableHead>Điều chỉnh (đ)</TableHead>
                                                    <TableHead>Hệ số nhân</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(mockRules[selectedTripId] || Array.from({ length: 7 }, (_, i) => i + 1)).map((r: any) => (
                                                    <TableRow key={r.week_day || r}>
                                                        <TableCell>{r.week_day || r}</TableCell>
                                                        <TableCell>{r.price_adjustment ? `${r.price_adjustment}đ` : '0'}</TableCell>
                                                        <TableCell>{r.multiplier ?? 1}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Khung giờ và giá */}
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Giá theo khung giờ</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between bg-gray-100 p-2 rounded">
                                            <div>08:00</div>
                                            <div>400,000đ</div>
                                        </div>
                                        <div className="flex justify-between bg-gray-100 p-2 rounded">
                                            <div>12:00</div>
                                            <div>420,000đ</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                                <LucideInfo /> Chọn chuyến để xem chi tiết
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
