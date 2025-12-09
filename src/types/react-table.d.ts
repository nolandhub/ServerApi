import "@tanstack/react-table"
import type { FilterFn } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface FilterFns {
    dateRange: FilterFn<any>
  }
}