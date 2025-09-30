import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { EventEditSchema, useEventEditor } from "../../event-editor-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete"
import { LoaderIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function EventFormBasicsAddress() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EventEditSchema>()
  const { organization } = useEventEditor()

  const {
    query,
    predictions,
    isSearching,
    isLoadingDetails,
    showSuggestions,
    selectedPredictionId,
    handleInputChange,
    handlePredictionSelect,
    handleInputBlur,
    handleInputFocus,
  } = useAddressAutocomplete({
    onAddressSelect: (addressComponents) => {
      setValue("usingOrganizationAddress", false)
      setValue("streetAddress", addressComponents.address)
      setValue("city", addressComponents.city)
      setValue("state", addressComponents.state)
      setValue("zipCode", addressComponents.zipCode)
      setValue("country", addressComponents.country)
    },
  })

  const onUseOrganizationAddress = () => {
    setValue("usingOrganizationAddress", true)
    setValue("streetAddress", organization.address)
    setValue("city", organization.city)
    setValue("state", organization.state)
    setValue("zipCode", organization.zipCode)
    setValue("country", organization.country)
  }

  const usingAddress = watch("usingOrganizationAddress")

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-row gap-1">
          <Label>Use Organization Address</Label>
          <Controller
            name="usingOrganizationAddress"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  if (checked) {
                    onUseOrganizationAddress()
                  }
                }}
              />
            )}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label>Street Address</Label>
          <Controller
            name="streetAddress"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  placeholder="Start typing your address..."
                  value={query}
                  disabled={isLoadingDetails || usingAddress}
                  onChange={(e) => {
                    handleInputChange(e.target.value)
                    field.onChange(e.target.value)
                  }}
                  onFocus={handleInputFocus}
                  onBlur={() => {
                    handleInputBlur()
                    field.onBlur()
                  }}
                />

                {(isSearching || isLoadingDetails) && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                )}

                {showSuggestions && predictions.length > 0 && (
                  <div className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border p-1 shadow-md">
                    {predictions.map((prediction) => {
                      const isSelected = selectedPredictionId === prediction.placeId
                      const isDisabled = isLoadingDetails && !isSelected

                      return (
                        <div
                          key={prediction.placeId}
                          className={`relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none ${
                            isDisabled
                              ? "text-muted-foreground cursor-not-allowed opacity-50"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                          onClick={() => !isDisabled && handlePredictionSelect(prediction)}
                        >
                          <span className="flex-1">{prediction.description}</span>
                          {isSelected && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          />
          {errors.streetAddress && <p className="text-red-500">{errors.streetAddress.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label>City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input placeholder="City" disabled={isLoadingDetails || usingAddress} {...field} />
            )}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label>State</Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input placeholder="State" disabled={isLoadingDetails || usingAddress} {...field} />
            )}
          />
          {errors.state && <p className="text-red-500">{errors.state.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label>Zip Code</Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Zip Code"
                disabled={isLoadingDetails || usingAddress}
                {...field}
              />
            )}
          />
          {errors.zipCode && <p className="text-red-500">{errors.zipCode.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <Label>Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Input placeholder="Country" disabled={isLoadingDetails || usingAddress} {...field} />
            )}
          />
          {errors.country && <p className="text-red-500">{errors.country.message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
