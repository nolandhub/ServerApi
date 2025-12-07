import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Box,
    BookOpen,
    Settings,
    MoreHorizontal,
    Menu,
    LucideIcon
} from 'lucide-react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Icon as TablerIcon } from '@tabler/icons-react';
import { redirect } from "next/navigation"


export function NavDropdown({
    title,
    icon: Icon,
    items,
}: {
    title: string;
    icon?: LucideIcon | TablerIcon;
    items: { title: string; icon?: LucideIcon | TablerIcon; url: string }[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={18} />}
                        <span>{title}</span>
                    </div>
                    {open ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-6 space-y-1">
                {items.map((item) => (
                    <Button
                        key={item.title}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => redirect(`/dashboard/${item.url}`)}
                    >
                        {item.icon && <item.icon size={16} />}
                        {item.title}
                    </Button>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
