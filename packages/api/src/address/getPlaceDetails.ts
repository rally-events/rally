import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { Context } from "../context"

const getPlaceDetailsSchema = z.object({
  placeId: z.string().min(1),
})

export interface AddressComponents {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface GooglePlaceDetailsResponse {
  addressComponents?: Array<{
    types?: string[]
    longText?: string
    shortText?: string
  }>
  formattedAddress?: string
  error?: {
    message: string
  }
}

export default async function getPlaceDetails(
  ctx: Context,
  input: z.infer<typeof getPlaceDetailsSchema>,
): Promise<AddressComponents> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Google Places API key not configured",
    })
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${input.placeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "addressComponents,formattedAddress",
      },
    })

    if (!response.ok) {
      console.error("Google Places API error:", await response.text())
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Google Places API error: ${response.statusText}`,
      })
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse

    if (data.error) {
      console.error("Google Places API error:", data.error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Google Places API error: ${data.error.message}`,
      })
    }

    // Parse address components using new API format
    const components = data.addressComponents || []
    let streetNumber = ""
    let route = ""
    let city = ""
    let state = ""
    let zipCode = ""
    let country = ""

    components.forEach((component) => {
      const types = component.types || []

      if (types.includes("street_number")) {
        streetNumber = component.longText || ""
      } else if (types.includes("route")) {
        route = component.longText || ""
      } else if (types.includes("locality") || types.includes("sublocality")) {
        city = component.longText || ""
      } else if (types.includes("administrative_area_level_1")) {
        state = component.shortText || component.longText || ""
      } else if (types.includes("postal_code")) {
        zipCode = component.longText || ""
      } else if (types.includes("country")) {
        country = component.longText || ""
      }
    })

    // Construct full address
    const address = [streetNumber, route].filter(Boolean).join(" ") || data.formattedAddress || ""

    return {
      address,
      city,
      state,
      zipCode,
      country,
    }
  } catch (error) {
    console.error("Error fetching place details:", error)
    if (error instanceof TRPCError) {
      throw error
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch place details",
    })
  }
}
