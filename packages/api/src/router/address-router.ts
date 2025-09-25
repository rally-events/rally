import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import searchAddress from "../address/searchAddress"
import getPlaceDetails from "../address/getPlaceDetails"

const searchAddressSchema = z.object({
  query: z.string().min(1).max(200),
})

const getPlaceDetailsSchema = z.object({
  placeId: z.string().min(1),
})

export const addressRouter = router({
  searchAddress: publicProcedure
    .input(searchAddressSchema)
    .mutation(async ({ ctx, input }) => await searchAddress(ctx, input)),

  getPlaceDetails: publicProcedure
    .input(getPlaceDetailsSchema)
    .mutation(async ({ ctx, input }) => await getPlaceDetails(ctx, input)),
})