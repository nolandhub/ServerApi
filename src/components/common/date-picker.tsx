"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Calendar22Props = {
    label?: string
    date: Date | undefined
    onSelect: (date: Date | undefined) => void
}

export function Calendar22({ label, date, onSelect }: Calendar22Props) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className="w-48 justify-between font-normal"
                    >
                        {date ? format(date, "dd/MM/yyyy") : "Select date"}
                        <ChevronDownIcon className="ml-2 size-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setOpen(false)
                            onSelect(date)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
