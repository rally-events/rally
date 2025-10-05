"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format, formatDuration, intervalToDuration } from "date-fns"
import type { AppRouter } from "@rally/api"
import type { inferRouterOutputs } from "@trpc/server"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings2 } from "lucide-react"

type RouterOutputs = inferRouterOutputs<AppRouter>
type EventSearchResult = RouterOutputs["event"]["searchEvents"]
type EventRow = EventSearchResult[number]

interface HostEventsDataTableProps {
  data: EventSearchResult
  isLoading: boolean
}

const columns: ColumnDef<EventRow>[] = [
  {
    accessorKey: "name",
    header: "Event Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "streetAddress",
    header: "Street Address",
    cell: ({ row }) => {
      const address = row.getValue("streetAddress") as string | null
      return address || "—"
    },
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => {
      const city = row.getValue("city") as string | null
      return city || "—"
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const state = row.getValue("state") as string | null
      return state || "—"
    },
  },
  {
    accessorKey: "startDatetime",
    header: "Start Time",
    cell: ({ row }) => {
      const date = row.getValue("startDatetime") as Date | null
      return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
    },
  },
  {
    accessorKey: "endDatetime",
    header: "End Time",
    cell: ({ row }) => {
      const date = row.getValue("endDatetime") as Date | null
      return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
    },
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const start = row.getValue("startDatetime") as Date | null
      const end = row.getValue("endDatetime") as Date | null
      if (!start || !end) return "—"

      const duration = intervalToDuration({
        start: new Date(start),
        end: new Date(end),
      })

      return formatDuration(duration, {
        format: ["days", "hours", "minutes"],
        delimiter: ", ",
      })
    },
  },
  {
    accessorKey: "expectedAttendeesMin",
    header: "Min Attendees",
    cell: ({ row }) => {
      const min = row.getValue("expectedAttendeesMin") as number | null
      return min !== null ? min.toLocaleString() : "—"
    },
  },
  {
    accessorKey: "expectedAttendeesMax",
    header: "Max Attendees",
    cell: ({ row }) => {
      const max = row.getValue("expectedAttendeesMax") as number | null
      return max !== null ? max.toLocaleString() : "—"
    },
  },
  {
    accessorKey: "audienceAge",
    header: "Audience Age",
    cell: ({ row }) => {
      const ages = row.getValue("audienceAge") as string[] | null
      return ages && ages.length > 0 ? ages.join(", ") : "—"
    },
  },
  {
    accessorKey: "hasFamousPeople",
    header: "Has Famous People",
    cell: ({ row }) => {
      const hasFamous = row.getValue("hasFamousPeople") as boolean | null
      return hasFamous ? "Yes" : "No"
    },
  },
  {
    accessorKey: "isTicketed",
    header: "Ticketed",
    cell: ({ row }) => {
      const isTicketed = row.getValue("isTicketed") as boolean
      return isTicketed ? "Yes" : "No"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date | null
      return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | null
      return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
    },
  },
]

const defaultColumnVisibility: VisibilityState = {
  name: true,
  streetAddress: false,
  city: false,
  state: false,
  startDatetime: true,
  endDatetime: true,
  duration: false,
  expectedAttendeesMin: false,
  expectedAttendeesMax: false,
  audienceAge: false,
  hasFamousPeople: false,
  isTicketed: false,
  createdAt: true,
  updatedAt: true,
}

export default function HostEventsDataTable({ data, isLoading }: HostEventsDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility)

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-12">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell />
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="bg-muted h-4 animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="w-12">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-56">
                    <div className="space-y-2">
                      <div className="font-medium text-sm">Toggle Columns</div>
                      {table.getVisibleLeafColumns().length >= 7 && (
                        <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 p-2 rounded">
                          Maximum of 7 columns selected
                        </div>
                      )}
                      <div className="space-y-2">
                        {table.getAllColumns().map((column) => {
                          const columnId = column.id
                          const header =
                            typeof column.columnDef.header === "string"
                              ? column.columnDef.header
                              : columnId
                          const isVisible = column.getIsVisible()
                          const visibleCount = table.getVisibleLeafColumns().length
                          const isDisabled = !isVisible && visibleCount >= 7

                          return (
                            <div key={columnId} className="flex items-center space-x-2">
                              <Checkbox
                                id={columnId}
                                checked={isVisible}
                                disabled={isDisabled}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                              />
                              <label
                                htmlFor={columnId}
                                className={`text-sm font-normal leading-none cursor-pointer ${
                                  isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                }`}
                              >
                                {header}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                <TableCell />
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
