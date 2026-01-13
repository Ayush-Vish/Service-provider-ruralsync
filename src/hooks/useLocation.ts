import { useState, useEffect, useCallback } from 'react'
import { useLocationStore } from '@/stores/location.store'
import { getLocation, reverseGeocode, type Position, type LocationError } from '@/lib/location'

export default function useLocation() {
  const {
    latitude,
    longitude,
    city,
    state,
    displayName,
    street,
    zipCode,
    isDetecting,
    error: storeError,
    setLocation,
    setDetecting,
    setError,
    hasLocation,
    getCoordinates,
    getAddressObject,
    getMongoDBLocation,
  } = useLocationStore()

  const [localError, setLocalError] = useState<LocationError | null>(null)

  // Detect location on mount if not already set
  useEffect(() => {
    if (!hasLocation() && !isDetecting) {
      detectLocation()
    }
  }, [])

  const detectLocation = useCallback(async () => {
    setDetecting(true)
    setLocalError(null)

    try {
      const position = await getLocation()
      
      // Reverse geocode to get address details
      const geocodeResult = await reverseGeocode(position.latitude, position.longitude)
      
      if (geocodeResult) {
        setLocation({
          latitude: position.latitude,
          longitude: position.longitude,
          city: geocodeResult.city,
          state: geocodeResult.state,
          displayName: geocodeResult.displayName,
          street: geocodeResult.street,
          zipCode: geocodeResult.zipCode,
        })
      } else {
        setLocation({
          latitude: position.latitude,
          longitude: position.longitude,
        })
      }
    } catch (error: any) {
      const err: LocationError = {
        code: error.code || 0,
        message: error.message || "Failed to detect location",
      }
      setLocalError(err)
      setError(err.message)
    } finally {
      setDetecting(false)
    }
  }, [setLocation, setDetecting, setError])

  // Get location object for forms (backward compatible)
  const location: Position | undefined = latitude !== null && longitude !== null
    ? { latitude, longitude }
    : undefined

  return {
    // Backward compatible
    location,
    error: localError,
    
    // New properties
    latitude,
    longitude,
    city,
    state,
    displayName,
    street,
    zipCode,
    isDetecting,
    
    // Actions
    detectLocation,
    setLocation,
    
    // Helpers
    hasLocation,
    getCoordinates,
    getAddressObject,
    getMongoDBLocation,
  }
}
