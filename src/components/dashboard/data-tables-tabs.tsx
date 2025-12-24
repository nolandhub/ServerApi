"use client"
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTicket, listenTickets } from "@/firebase/firestore/ticketFunc"
import { getAllSaleConfigs } from "@/services/saleConfigs"
import { TicketTable } from "../table/table-ticket/table-ticket"
import { SaleConfigTable } from "../table/table-saleconfig/table-sale-config"


export interface TableTabConfig<T> {
  key: string
  label: string
  fetcher?: () => Promise<T[]>
  listener?: (callBack: (data: T[]) => void) => () => void
}

export const TABLE_TABS: TableTabConfig<any>[] = [
  {
    key: "ticket",
    label: "Danh sách đặt vé",
    listener: listenTickets
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

    let unsubscribe: (() => void) | undefined

    // 🔥 realtime
    if (activeTab.listener) {
      setLoading(true)
      unsubscribe = activeTab.listener((items) => {
        setData(items)
        setLoading(false)
      })
    }

    // 🔥 fetch 1 lần
    if (activeTab.fetcher) {
      setLoading(true)
      activeTab.fetcher()
        .then(setData)
        .finally(() => setLoading(false))
    }

    return () => unsubscribe?.()
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
