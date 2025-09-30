import { onboardingFormSchema } from "@rally/schemas"
import { TRPCContext } from "../context"
import z from "zod"
import { TRPCError } from "@trpc/server"
import {
  db,
  eq,
  organizationsTable,
  hostOrganizationsTable,
  sponsorOrganizationsTable,
  organizationMembersTable,
  usersTable,
} from "@rally/db"

export default async function createOrganization(
  ctx: TRPCContext,
  input: z.infer<typeof onboardingFormSchema>,
) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to create an organization",
    })
  }

  // Check if user already belongs to an organization
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, ctx.user.id),
  })

  if (!existingUser) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  if (existingUser.organizationId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are already a member of an organization",
    })
  }

  try {
    // Create organization and related records in a transaction
    const result = await db.transaction(async (tx) => {
      // 1. Create the main organization
      const [organization] = await tx
        .insert(organizationsTable)
        .values({
          name: input.organizationName,
          type: input.organizationType,
          instagram: input.instagram || null,
          tiktok: input.tiktok || null,
          website: input.website || null,
          contactEmail: input.contactEmail,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          country: input.country,
          agreeToTerms: input.agreeToTerms,
          isUsBasedOrganization: input.isUsBasedOrganization,
        })
        .returning()

      // 2. Create type-specific organization data
      if (input.organizationType === "host") {
        await tx.insert(hostOrganizationsTable).values({
          organizationId: organization.id,
          hostOrganizationType: input.hostOrganizationType,
          eventsPerYear: input.eventsPerYear,
        })
      } else if (input.organizationType === "sponsor") {
        await tx.insert(sponsorOrganizationsTable).values({
          organizationId: organization.id,
          industry: input.industry,
          employeeSize: input.employeeSize,
        })
      }

      // 3. Add user as owner in organization members
      await tx.insert(organizationMembersTable).values({
        organizationId: organization.id,
        userId: ctx.user!.id,
        role: "owner",
      })

      // 4. Update user's organizationId
      await tx
        .update(usersTable)
        .set({ organizationId: organization.id })
        .where(eq(usersTable.id, ctx.user!.id))

      return organization
    })

    // 5. Update Supabase user metadata to mark onboarding as complete
    const { error: metadataError } = await ctx.supabase.auth.updateUser({
      data: {
        ...ctx.user.user_metadata,
        organization_type: input.organizationType,
      },
    })

    if (metadataError) {
      console.error("[createOrganization] Failed to update user metadata:", metadataError)
      // Don't throw - organization was created successfully, metadata update is non-critical
    }

    return {
      success: true,
      organization: result,
    }
  } catch (error) {
    console.error("[createOrganization] Error creating organization:", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create organization. Please try again.",
    })
  }
}
