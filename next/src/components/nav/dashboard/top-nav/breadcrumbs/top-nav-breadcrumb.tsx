"use client"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { breadcrumbConfig, skipSegments } from "./breadcrumb-config"

type BreadcrumbSegment = {
  label: string
  href: string
  isLast: boolean
  isDynamic: boolean
  isLoading?: boolean
}

export default function TopNavBreadcrumb() {
  const pathname = usePathname()
  const [segments, setSegments] = useState<BreadcrumbSegment[]>([])

  useEffect(() => {
    const buildBreadcrumbs = async () => {
      // Split path and filter out empty strings and skip segments
      const pathSegments = pathname
        .split("/")
        .filter((segment) => segment && !skipSegments.includes(segment))

      const breadcrumbs: BreadcrumbSegment[] = []
      let currentPath = "/dashboard"

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i]!
        const isLast = i === pathSegments.length - 1
        const isDynamic = segment.match(/^[a-f0-9-]{36}$/) || !isNaN(Number(segment)) // UUID or numeric ID

        // Build the current path for this segment
        currentPath += `/${segment}`

        // Check if previous segment has dynamic config
        const prevSegment = i > 0 ? pathSegments[i - 1] : null
        const prevConfig = prevSegment ? breadcrumbConfig[prevSegment] : null

        let label = segment

        if (isDynamic && prevConfig?.dynamic?.["[id]"]) {
          // Set loading state initially
          breadcrumbs.push({
            label: "...",
            href: currentPath,
            isLast,
            isDynamic: true,
            isLoading: true,
          })

          // Fetch dynamic label
          try {
            const fetchedLabel = await prevConfig.dynamic["[id]"](segment)
            // Update the breadcrumb with fetched label
            const index = breadcrumbs.length - 1
            breadcrumbs[index] = {
              label: fetchedLabel,
              href: currentPath,
              isLast,
              isDynamic: true,
              isLoading: false,
            }
          } catch (error) {
            // Fallback to segment ID on error
            const index = breadcrumbs.length - 1
            breadcrumbs[index] = {
              label: segment,
              href: currentPath,
              isLast,
              isDynamic: true,
              isLoading: false,
            }
          }
        } else {
          // Static segment
          const config = breadcrumbConfig[segment]

          // Skip hidden segments
          if (config?.hide) {
            continue
          }

          label = config?.label || segment.charAt(0).toUpperCase() + segment.slice(1)

          breadcrumbs.push({
            label,
            href: config?.redirect || currentPath,
            isLast,
            isDynamic: false,
          })
        }
      }

      setSegments(breadcrumbs)
    }

    buildBreadcrumbs()
  }, [pathname])

  console.log(segments)

  if (segments.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!segment.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
