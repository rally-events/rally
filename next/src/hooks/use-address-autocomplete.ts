"use client"

import { useState, useRef, useCallback } from "react"
import { api } from "@/lib/trpc/client"

interface AddressPrediction {
  placeId: string
  description: string
}

interface AddressComponents {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface UseAddressAutocompleteOptions {
  onAddressSelect?: (address: AddressComponents) => void
  debounceMs?: number
}

export function useAddressAutocomplete({
  onAddressSelect,
  debounceMs = 500,
}: UseAddressAutocompleteOptions = {}) {
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<AddressPrediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null)

  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const searchAbortControllerRef = useRef<AbortController | undefined>(undefined)

  const searchAddressMutation = api.address.searchAddress.useMutation()
  const getPlaceDetailsMutation = api.address.getPlaceDetails.useMutation()

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setPredictions([])
        setIsSearching(false)
        return
      }

      // Cancel previous search if still running
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort()
      }

      searchAbortControllerRef.current = new AbortController()

      try {
        const result = await searchAddressMutation.mutateAsync({
          query: searchQuery,
        })

        setPredictions(result)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Address search error:", error)
        setPredictions([])
      } finally {
        setIsSearching(false)
      }
    },
    [searchAddressMutation],
  )

  const handleInputChange = useCallback(
    (value: string, bypassSearch = false) => {
      setQuery(value)

      if (bypassSearch) {
        return
      }

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Show loading immediately if there's a value
      if (value.trim()) {
        setIsSearching(true)
        setShowSuggestions(true)
      } else {
        setIsSearching(false)
        setPredictions([])
        setShowSuggestions(false)
      }

      // Set new timeout for search
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(value)
      }, debounceMs)
    },
    [performSearch, debounceMs],
  )

  const handlePredictionSelect = useCallback(
    async (prediction: AddressPrediction) => {
      setSelectedPredictionId(prediction.placeId)
      setIsLoadingDetails(true)
      // Keep suggestions open during loading

      try {
        const addressComponents = await getPlaceDetailsMutation.mutateAsync({
          placeId: prediction.placeId,
        })

        // Only set the street address part in the query, not the full description
        setQuery(addressComponents.address)
        onAddressSelect?.(addressComponents)
      } catch (error) {
        console.error("Error fetching place details:", error)
        // Keep the description in the input even if details fail
        setQuery(prediction.description)
      } finally {
        setIsLoadingDetails(false)
        setSelectedPredictionId(null)
        setShowSuggestions(false)
      }
    },
    [getPlaceDetailsMutation, onAddressSelect],
  )

  const handleInputBlur = useCallback(() => {
    // Small delay to allow for click on suggestion, but don't close if loading
    setTimeout(() => {
      if (!isLoadingDetails) {
        setShowSuggestions(false)
      }
    }, 150)
  }, [isLoadingDetails])

  const handleInputFocus = useCallback(() => {
    if (predictions.length > 0 && query.trim()) {
      setShowSuggestions(true)
    }
  }, [predictions.length, query])

  const clearSuggestions = useCallback(() => {
    setShowSuggestions(false)
    setPredictions([])
    setIsSearching(false)
  }, [])

  const reset = useCallback(() => {
    setQuery("")
    setPredictions([])
    setIsSearching(false)
    setIsLoadingDetails(false)
    setShowSuggestions(false)
    setSelectedPredictionId(null)

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort()
    }
  }, [])

  return {
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
    clearSuggestions,
    reset,
  }
}
