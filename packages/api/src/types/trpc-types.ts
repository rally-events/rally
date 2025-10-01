import getEvent from "../events/getEvent"
import getUserInfo from "../user/getUserInfo"
import {
  organizationsTable,
  organizationMembersTable,
  mediaTable,
  usersTable,
  InferSelectModel,
} from "@rally/db"
import { SupabaseUserMetadata } from "../user/getUserInfo"

// Get the raw types from the functions
type RawEventInfo = NonNullable<Awaited<ReturnType<typeof getEvent>>>
type RawUserInfo = NonNullable<Awaited<ReturnType<typeof getUserInfo>>>

// Base types without optional properties
export type BaseEventInfo = Omit<RawEventInfo, "organization" | "media" | "updatedByUser">
export type BaseUserInfo = Omit<RawUserInfo, "organization" | "organizationMembership" | "supabaseMetadata">

// Event type parameters interface
export interface EventInfoParams {
  withOrganization?: boolean
  withMedia?: boolean
  withUpdatedByUser?: boolean
}

// User type parameters interface
export interface UserInfoParams {
  withOrganization?: boolean
  withOrganizationMembership?: boolean
}

// Conditional EventInfo type that includes properties based on parameters
export type EventInfo<T extends EventInfoParams = {}> = BaseEventInfo &
  (T extends { withOrganization: true }
    ? { organization: InferSelectModel<typeof organizationsTable> | null }
    : {}) &
  (T extends { withMedia: true } ? { media: InferSelectModel<typeof mediaTable>[] } : {}) &
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
    : {}) & {
    supabaseMetadata: SupabaseUserMetadata
  }
