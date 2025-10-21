import getEvent from "../events/getEvent"
import getUserInfo from "../user/getUserInfo"
import {
  organizationsTable,
  organizationMembersTable,
  mediaTable,
  usersTable,
  InferSelectModel,
  eventsMediaTable,
  notificationsTable,
  phoneChallengeTable,
  authenticatorChallengeTable,
} from "@rally/db"
import { SupabaseUserMetadata } from "../user/getUserInfo"
import searchEvents from "../events/searchEvents"
import z from "zod"
import { getUserInfoSchema } from "@rally/schemas"

export type EventSearchInfo = NonNullable<Awaited<ReturnType<typeof searchEvents>>>

// Get the raw types from the functions
type RawEventInfo = NonNullable<Awaited<ReturnType<typeof getEvent>>>
type RawUserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>
export type MediaInfo = InferSelectModel<typeof eventsMediaTable> & {
  downloadUrl: string
  media: InferSelectModel<typeof mediaTable>
}

// Base types without optional properties
export type BaseEventInfo = Omit<RawEventInfo, "organization" | "media" | "updatedByUser">
export type BaseUserInfo = Omit<
  RawUserInfo,
  "organization" | "organizationMembership" | "supabaseMetadata" | "phoneChallenge" | "authenticatorChallenge"
>

export type NotificationInfo = InferSelectModel<typeof notificationsTable>

// Event type parameters interface
export interface EventInfoParams {
  withOrganization?: boolean
  withMedia?: boolean
  withUpdatedByUser?: boolean
  withChallenges?: boolean
}

// User type parameters interface

type UserInfoParams = z.infer<typeof getUserInfoSchema>

// Conditional EventInfo type that includes properties based on parameters
export type EventInfo<T extends EventInfoParams = {}> = BaseEventInfo &
  (T extends { withOrganization: true }
    ? { organization: InferSelectModel<typeof organizationsTable> | null }
    : {}) &
  (T extends { withMedia: true } ? { media: MediaInfo[] } : {}) &
  (T extends { withUpdatedByUser: true }
    ? { updatedByUser: InferSelectModel<typeof usersTable> | null }
    : {})

// Conditional UserInfo type that includes properties based on parameters
export type UserInfo<T extends UserInfoParams = {}> = BaseUserInfo &
  (T extends { withOrganization: true }
    ? { organization: InferSelectModel<typeof organizationsTable> | null }
    : {}) &
  (T extends { withOrganizationMembership: true }
    ? { organizationMembership: InferSelectModel<typeof organizationMembersTable> | null }
    : {}) &
  (T extends { withNotifications: true } ? { notifications: NotificationInfo[] } : {}) &
  (T extends { withChallenges: true }
    ? {
        phoneChallenge: InferSelectModel<typeof phoneChallengeTable> | null
        authenticatorChallenge: InferSelectModel<typeof authenticatorChallengeTable> | null
      }
    : {}) & {
    supabaseMetadata: SupabaseUserMetadata
  }
