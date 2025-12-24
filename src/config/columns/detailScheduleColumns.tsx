'use client'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import z from "zod"
import { DetailScheduleSchema } from "../datafield/detailScheduleSchema"
import 'dayjs/locale/vi'

dayjs.locale('vi')
export const detailScheduleColumns: ColumnDef<z.infer<typeof DetailScheduleSchema>>[] = [
    {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <Button
                    {...{
                        className: 'size-7 text-muted-foreground',
                        onClick: row.getToggleExpandedHandler(),
                        'aria-expanded': row.getIsExpanded(),
                        'aria-label': row.getIsExpanded()
                            ? `Collapse details for ${row.original.busName}`
                            : `Expand details for ${row.original.busName}`,
                        size: 'icon',
                        variant: 'ghost'
                    }}
                >
                    {row.getIsExpanded() ? (
                        <ChevronUpIcon className='opacity-60' aria-hidden='true' />
                    ) : (
                        <ChevronDownIcon className='opacity-60' aria-hidden='true' />
                    )}
                </Button>
            ) : undefined
        }
    },
    {
        header: 'STT',
        accessorKey: 'stt',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('stt')}</div>
    },
    {
        header: 'Tên tuyến',
        accessorKey: 'routeName',
        cell: ({ row }) => row.getValue('routeName')
    },
    {
        header: 'Tên xe',
        accessorKey: 'busName',
        cell: ({ row }) => row.getValue('busName')
    },
    {
        header: 'Nhà xe',
        accessorKey: 'compName',
        cell: ({ row }) => row.getValue('compName')
    },
    {
        header: 'Loại giá',
        accessorKey: 'priceTypeName',
        cell: ({ row }) => row.getValue('priceTypeName')
    },
    {
        header: 'Ngày đi',
        accessorKey: 'instanceDate',
        cell: ({ row }) => <div>{

            dayjs(row.getValue('instanceDate')).format('dddd, DD/MM/YYYY')

        }</div>
    },
    {
        id: 'active',
        header: 'Trạng thái',
        cell: ({ row }) => {
            let active = row.original.isActive === 1 ? true : false
            return (
                < div className="flex items-center space-x-2" >
                    <Switch checked={active} className=" data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        id="state" />
                    <Label htmlFor="state">{active ? 'On' : 'Off'}</Label>
                </div >
            )
        }
    }
]