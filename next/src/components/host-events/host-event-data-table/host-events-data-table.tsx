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
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"
import HostDataTableDropdown from "./host-data-table-dropdown"
import { EVENT_HOST_TABLE_LIMIT } from "../host-events-list"
import { api } from "@/lib/trpc/client"
import { Skeleton } from "@/components/ui/skeleton"

type RouterOutputs = inferRouterOutputs<AppRouter>
type EventSearchResult = RouterOutputs["event"]["searchEvents"]["events"]
export type EventRow = EventSearchResult[number]

interface HostEventsDataTableProps {
  data: EventSearchResult
  isLoading: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
  onSortChange: (sortBy?: string, sortOrder?: "asc" | "desc") => void
  onDeleteEvent: (id: string) => void
  deleteEventPending: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

// Sortable columns
const sortableColumns = new Set([
  "name",
  "startDatetime",
  "endDatetime",
  "duration",
  "expectedAttendeesMin",
  "expectedAttendeesMax",
  "isTicketed",
  "createdAt",
  "updatedAt",
])

const createColumns = (
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  onSortChange?: (sortBy?: string, sortOrder?: "asc" | "desc") => void,
): ColumnDef<EventRow>[] => {
  const handleHeaderClick = (columnId: string) => {
    if (!sortableColumns.has(columnId) || !onSortChange) return

    if (sortBy === columnId) {
      // Cycle through: asc -> desc -> none
      if (sortOrder === "asc") {
        onSortChange(columnId, "desc")
      } else if (sortOrder === "desc") {
        onSortChange(undefined, undefined)
      }
    } else {
      // Start with ascending
      onSortChange(columnId, "asc")
    }
  }

  const getSortIcon = (columnId: string) => {
    if (sortBy !== columnId) return <ArrowUpDown className="ml-2 h-4 w-4" />
    if (sortOrder === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
    if (sortOrder === "desc") return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const createHeader = (columnId: string, label: string) => {
    if (!sortableColumns.has(columnId)) return label

    return ({ column }: any) => (
      <Button
        variant="ghost"
        onClick={() => handleHeaderClick(columnId)}
        className="data-[state=open]:bg-accent -ml-3 h-8"
      >
        {label}
        {getSortIcon(columnId)}
      </Button>
    )
  }

  return [
    {
      accessorKey: "name",
      header: createHeader("name", "Event Name"),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "streetAddress",
      header: createHeader("streetAddress", "Street Address"),
      cell: ({ row }) => {
        const address = row.getValue("streetAddress") as string | null
        return address || "—"
      },
    },
    {
      accessorKey: "city",
      header: createHeader("city", "City"),
      cell: ({ row }) => {
        const city = row.getValue("city") as string | null
        return city || "—"
      },
    },
    {
      accessorKey: "state",
      header: createHeader("state", "State"),
      cell: ({ row }) => {
        const state = row.getValue("state") as string | null
        return state || "—"
      },
    },
    {
      accessorKey: "startDatetime",
      header: createHeader("startDatetime", "Start Time"),
      cell: ({ row }) => {
        const date = row.getValue("startDatetime") as Date | null
        return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
      },
    },
    {
      accessorKey: "endDatetime",
      header: createHeader("endDatetime", "End Time"),
      cell: ({ row }) => {
        const date = row.getValue("endDatetime") as Date | null
        return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
      },
    },
    {
      id: "duration",
      header: createHeader("duration", "Duration"),
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
      header: createHeader("expectedAttendeesMin", "Min Attendees"),
      cell: ({ row }) => {
        const min = row.getValue("expectedAttendeesMin") as number | null
        return min !== null ? min.toLocaleString() : "—"
      },
    },
    {
      accessorKey: "expectedAttendeesMax",
      header: createHeader("expectedAttendeesMax", "Max Attendees"),
      cell: ({ row }) => {
        const max = row.getValue("expectedAttendeesMax") as number | null
        return max !== null ? max.toLocaleString() : "—"
      },
    },
    {
      accessorKey: "audienceAge",
      header: createHeader("audienceAge", "Audience Age"),
      cell: ({ row }) => {
        const ages = row.getValue("audienceAge") as string[] | null
        return ages && ages.length > 0 ? ages.join(", ") : "—"
      },
    },
    {
      accessorKey: "hasFamousPeople",
      header: createHeader("hasFamousPeople", "Has Famous People"),
      cell: ({ row }) => {
        const hasFamous = row.getValue("hasFamousPeople") as boolean | null
        return hasFamous ? "Yes" : "No"
      },
    },
    {
      accessorKey: "isTicketed",
      header: createHeader("isTicketed", "Ticketed"),
      cell: ({ row }) => {
        const isTicketed = row.getValue("isTicketed") as boolean
        return isTicketed ? "Yes" : "No"
      },
    },
    {
      accessorKey: "createdAt",
      header: createHeader("createdAt", "Created At"),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date | null
        return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
      },
    },
    {
      accessorKey: "updatedAt",
      header: createHeader("updatedAt", "Updated At"),
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as Date | null
        return date ? format(new Date(date), "MMM d, yyyy h:mm a") : "—"
      },
    },
  ]
}

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
  actions: true,
}

export default function HostEventsDataTable({
  data,
  isLoading,
  sortBy,
  sortOrder,
  onSortChange,
  onDeleteEvent,
  deleteEventPending,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: HostEventsDataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility)

  const columns = createColumns(sortBy, sortOrder, onSortChange)

  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = currentPage < totalPages - 1
  const hasPrevPage = currentPage > 0

  // Clear sorting when the sorted column is hidden
  useEffect(() => {
    if (sortBy && columnVisibility[sortBy] === false) {
      onSortChange(undefined, undefined)
    }
  }, [columnVisibility, sortBy, onSortChange])

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
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead className="w-12">
                    <Button variant="ghost" size="iconSm" disabled>
                      <Settings2 />
                    </Button>
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                  <TableHead />
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {[...Array(EVENT_HOST_TABLE_LIMIT)].map((_, index) => (
                <TableRow key={index} className="h-[49px]">
                  <TableCell />
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <div className="bg-muted h-8 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            <Skeleton className="h-5 w-42" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24.5" />
            <Skeleton className="h-5 w-19" />
            <Skeleton className="h-8 w-24.5" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-12">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="iconSm">
                        <Settings2 />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Toggle Columns</div>
                        {table.getVisibleLeafColumns().length >= 7 && (
                          <div className="bg-warning-background text-warning border-warning-border rounded border p-2 text-xs">
                            Maximum of 7 columns selected
                          </div>
                        )}
                        <div className="space-y-2">
                          {table.getAllColumns().map((column) => {
                            const columnId = column.id
                            // Skip the actions column from visibility settings
                            if (columnId === "actions") return null

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
                                  className={`cursor-pointer text-sm leading-none font-normal ${
                                    isDisabled
                                      ? "cursor-not-allowed opacity-50"
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
                <TableHead className="w-12" />
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    <TableCell />
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    <TableCell className="w-12">
                      <HostDataTableDropdown
                        row={row}
                        handleDeleteEvent={() => onDeleteEvent(row.original.id)}
                        deleteEventPending={deleteEventPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Ghost rows to maintain consistent height */}
                {Array.from({
                  length: Math.max(0, pageSize - table.getRowModel().rows.length),
                }).map((_, index) => (
                  <TableRow
                    key={`ghost-${index}`}
                    className="pointer-events-none border-transparent"
                  >
                    <TableCell className="h-[49px]" />
                    {table.getVisibleLeafColumns().map((column) => (
                      <TableCell key={column.id} className="h-[49px]" />
                    ))}
                    <TableCell className="h-[49px] w-12" />
                  </TableRow>
                ))}
              </>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {totalCount === 0 ? 0 : currentPage * pageSize + 1} to{" "}
          {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">
            Page {totalCount === 0 ? 0 : currentPage + 1} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
