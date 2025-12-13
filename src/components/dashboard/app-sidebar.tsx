"use client"

import * as React from "react"
import {
  IconRoute,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconBus,
  IconRoad,
  IconStar,
  IconCube,
  IconPigMoney
} from "@tabler/icons-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import { NavDropdown } from "./nav-dropdown"
import { CalendarClock, Clock } from "lucide-react"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Chi tiết lịch trình",
      url: "detailtrip",
      icon: CalendarClock,
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch
    },
  ],
  navTrip: [
    {
      title: "Thông tin chuyến",
      icon: IconRoad,
      url: "trip"
    },
    {
      title: "Thời gian khởi hành",
      icon: Clock,
      url: "triptime"
    },
    {
      title: "Giá tiền theo khung giờ",
      icon: IconPigMoney,
      url: "baseprice"
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ProbusVN Vé Xe Limousine</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDropdown icon={IconCube} title="Quản lý chuyến" items={data.navTrip} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
