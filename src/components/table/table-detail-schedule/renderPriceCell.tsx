import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailScheduleSchema } from "@/config/datafield/detailScheduleSchema";
import { Row } from "@tanstack/react-table";
import z from "zod";

export const renderPrice = (row: Row<z.infer<typeof DetailScheduleSchema>>) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px] text-center">Giờ chạy</TableHead>
                <TableHead>Giá vé gốc</TableHead>
                <TableHead>Giá vé điều chỉnh</TableHead>
                <TableHead>Giá vé hiển thị</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {row.original.priceDetails.map(price => (
                <TableRow key={price.time}>
                    {/* Giờ */}
                    <TableCell className="font-medium text-center">
                        {price.time}
                    </TableCell>

                    {/* Giá */}
                    <TableCell>
                        <div className="flex flex-col gap-2">
                            {price.detail.map(d => (
                                <Badge
                                    key={`${price.time}-${d.label}`}
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    {d.label}: {d.basePrice.toLocaleString()}đ
                                </Badge>
                            ))}
                        </div>
                    </TableCell>

                    <TableCell>
                        <div className="flex flex-col gap-2">
                            {price.detail.map(d => (
                                <Badge
                                    key={`${d.priceInstanceId}`}
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    {d.label}: {d.adjustedPrice.toLocaleString()}đ
                                </Badge>
                            ))}
                        </div>
                    </TableCell>


                </TableRow>
            ))}


        </TableBody>
    </Table>
)

