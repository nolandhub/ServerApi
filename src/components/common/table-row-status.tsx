import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

export function TableRowLoading({ colSpan }: { colSpan: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-40 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Button variant="outline" disabled size="sm">
                        <Spinner />
                        Đang tải...
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export function TableRowEmpty({ colSpan }: { colSpan: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                Không có dữ liệu
            </TableCell>
        </TableRow>
    )
}