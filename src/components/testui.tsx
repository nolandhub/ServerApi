/*
SQL Schema (suggested)
----------------------
-- Trips table (existing)
CREATE TABLE trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  company_id INT NOT NULL,
  bus_id INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  price_type_id INT DEFAULT NULL
);

-- Price rules per trip per weekday
CREATE TABLE pricing_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  week_day TINYINT NOT NULL COMMENT '1=Mon .. 7=Sun',
  price_adjustment DECIMAL(10,2) DEFAULT 0 COMMENT 'absolute add/subtract',
  multiplier DECIMAL(5,4) DEFAULT 1.0 COMMENT 'multiply base_price, override if non-1',
  UNIQUE(trip_id, week_day)
);

-- Sales / promotions
CREATE TABLE sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  type ENUM('percent','fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  start_date DATE,
  end_date DATE
);

-- Which sale applies to which trip / route / company (data-driven)
CREATE TABLE sale_targets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sale_id INT NOT NULL,
  trip_id INT DEFAULT NULL,
  route_id INT DEFAULT NULL,
  company_id INT DEFAULT NULL
);

-- Precomputed cache for fast UI (optional)
CREATE TABLE trip_price_cache (
  trip_id INT PRIMARY KEY,
  date DATE NOT NULL,
  final_price DECIMAL(10,2) NOT NULL,
  applied_sale_id INT NULL
);

*/

// shadcn components assumed available
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
    { id: 1, routeName: 'DN - HN', companyName: 'Phuong Trang', busName: 'F01', basePrice: 400000, priceType: 'Standard' },
    { id: 2, routeName: 'DN - Hoi An', companyName: 'LocalBus', busName: 'L02', basePrice: 150000, priceType: 'Express' },
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
        // JS: 0=Sun .. 6=Sat -> convert to 1..7 (Mon=1.. Sun=7)
        const js = pickedDate.getDay();
        return js === 0 ? 7 : js;
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
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LucideCalendar />
                        <CardTitle>Pricing — Preview</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar22 date={pickedDate} onSelect={(date) => setPickedDate(date)} />
                        <Select onValueChange={(v) => console.log('filter', v)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter route / company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="company:1">Phuong Trang</SelectItem>
                                <SelectItem value="company:2">LocalBus</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => alert('Apply filters (call API)')}>Apply</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Picked date: {pickedDate ? format(pickedDate, 'yyyy-MM-dd (EEEE)') : '—'}</div>

                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Trip</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Bus</TableHead>
                                    <TableHead>Sale</TableHead>
                                    <TableHead>Price Rule</TableHead>
                                    <TableHead>Final Price</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTrips.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell>{t.id}</TableCell>
                                        <TableCell>{t.routeName}</TableCell>
                                        <TableCell>{t.companyName}</TableCell>
                                        <TableCell>{t.busName}</TableCell>
                                        <TableCell>{mockSales[t.id] ? `${mockSales[t.id]!.name} (${mockSales[t.id]!.type === 'percent' ? mockSales[t.id]!.value + '%' : mockSales[t.id]!.value + 'đ'})` : '—'}</TableCell>
                                        <TableCell>
                                            {/* Show compact rule summary */}
                                            {(mockRules[t.id] || []).length ? (
                                                <div className="text-sm">
                                                    {(mockRules[t.id] || []).map(r => (
                                                        <div key={r.week_day}>Thứ {r.week_day}: {r.price_adjustment ? `+${r.price_adjustment}` : ''}{r.multiplier && r.multiplier !== 1 ? ` x${r.multiplier}` : ''}</div>
                                                    ))}
                                                </div>
                                            ) : 'Default'}
                                        </TableCell>
                                        <TableCell>{Intl.NumberFormat('vi-VN').format(computeFinalPrice(t))}đ</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => openDetails(t.id)}>View</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Trip Pricing Details</DrawerTitle>
                    </DrawerHeader>
                    <div>
                        {selectedTripId ? (
                            <div className="space-y-4">
                                {/* Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Trip #{selectedTripId}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Price Type</div>
                                                <div>Standard</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Transfer Type</div>
                                                <div>Direct</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Weekday table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weekday Adjustments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Weekday</TableHead>
                                                    <TableHead>Adjustment</TableHead>
                                                    <TableHead>Multiplier</TableHead>
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

                                {/* Time slots / prices */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Time - Price (per trip)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>08:00</div>
                                                <div>400,000đ</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>12:00</div>
                                                <div>420,000đ</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LucideInfo /> Select a trip to view details
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
