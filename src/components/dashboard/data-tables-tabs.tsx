"use client"
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTicket } from "@/firebase/firestore/ticketFunc"
import { getAllSaleConfigs } from "@/services/saleConfigs"
import { TicketTable } from "../table/ticket/table-ticket"
import { SaleConfigTable } from "../table/saleconfig/table-sale-config"


export interface TableTabConfig<T> {
  key: string
  label: string
  fetcher: () => Promise<T[]>
}

export const TABLE_TABS: TableTabConfig<any>[] = [
  {
    key: "ticket",
    label: "Danh sách đặt vé",
    fetcher: getAllTicket
  },
  {
    key: "sale-config",
    label: "Sales hiện tại",
    fetcher: getAllSaleConfigs
  }
]

export function TableTabs() {
  const [activeKey, setActiveKey] = React.useState(TABLE_TABS[0].key)
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  const activeTab = React.useMemo(
    () => TABLE_TABS.find(tab => tab.key === activeKey),
    [activeKey]
  )

  React.useEffect(() => {
    if (!activeTab) return

    setLoading(true)

    activeTab.fetcher()
      .then(setData)
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <Tabs value={activeKey} onValueChange={setActiveKey}>
      <TabsList>
        {TABLE_TABS.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="ticket">
        <TicketTable data={data} loading={loading} />
      </TabsContent>

      <TabsContent value="sale-config">
        <SaleConfigTable data={data} loading={loading} />
      </TabsContent>

    </Tabs>
  )
}
