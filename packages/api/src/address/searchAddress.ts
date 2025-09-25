import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { Context } from "../context"

const searchAddressSchema = z.object({
  query: z.string().min(1).max(200),
})

export interface AddressPrediction {
  placeId: string
  description: string
}

interface GooglePlacesAutocompleteResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string
      text?: {
        text?: string
      }
    }
  }>
  error?: {
    message: string
  }
}

export default async function searchAddress(
  ctx: Context,
  input: z.infer<typeof searchAddressSchema>,
): Promise<AddressPrediction[]> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Google Places API key not configured",
    })
  }

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify({
        input: input.query,
        includedPrimaryTypes: [
          "street_address",
          "route",
          "locality",
          "postal_code",
          "neighborhood",
        ],
      }),
    })

    if (!response.ok) {
      console.error("Google Places API error:", await response.text())
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Google Places API error: ${response.statusText}`,
      })
    }

    const data = (await response.json()) as GooglePlacesAutocompleteResponse

    if (data.error) {
      console.error("Google Places API error:", data.error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Google Places API error: ${data.error.message}`,
      })
    }

    return (
      data.suggestions
        ?.map((suggestion) => ({
          placeId: suggestion.placePrediction?.placeId || "",
          description: suggestion.placePrediction?.text?.text || "",
        }))
        .filter((pred) => pred.placeId && pred.description) || []
    )
  } catch (error) {
    console.error("Error fetching address predictions:", error)
    if (error instanceof TRPCError) {
      throw error
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch address suggestions",
    })
  }
}
