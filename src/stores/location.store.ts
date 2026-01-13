import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocationState {
  // Current location data
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  displayName: string | null;
  street: string | null;
  zipCode: string | null;

  // Loading states
  isDetecting: boolean;
  error: string | null;

  // Actions
  setLocation: (location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    displayName?: string;
    street?: string;
    zipCode?: string;
  }) => void;
  setDetecting: (isDetecting: boolean) => void;
  setError: (error: string | null) => void;
  clearLocation: () => void;

  // Computed
  hasLocation: () => boolean;
  getCoordinates: () => { lat: number; lng: number } | null;
  getAddressObject: () => {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  getMongoDBLocation: () => { type: "Point"; coordinates: [number, number] } | null;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      // Initial state
      latitude: null,
      longitude: null,
      city: null,
      state: null,
      displayName: null,
      street: null,
      zipCode: null,
      isDetecting: false,
      error: null,

      // Actions
      setLocation: (location) => {
        set({
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city || null,
          state: location.state || null,
          displayName: location.displayName || null,
          street: location.street || null,
          zipCode: location.zipCode || null,
          error: null,
        });
      },

      setDetecting: (isDetecting) => {
        set({ isDetecting });
      },

      setError: (error) => {
        set({ error, isDetecting: false });
      },

      clearLocation: () => {
        set({
          latitude: null,
          longitude: null,
          city: null,
          state: null,
          displayName: null,
          street: null,
          zipCode: null,
          error: null,
        });
      },

      // Computed
      hasLocation: () => {
        const state = get();
        return state.latitude !== null && state.longitude !== null;
      },

      getCoordinates: () => {
        const state = get();
        if (state.latitude !== null && state.longitude !== null) {
          return { lat: state.latitude, lng: state.longitude };
        }
        return null;
      },

      getAddressObject: () => {
        const state = get();
        return {
          street: state.street || "",
          city: state.city || "",
          state: state.state || "",
          zipCode: state.zipCode || "",
          country: "India",
        };
      },

      getMongoDBLocation: () => {
        const state = get();
        if (state.latitude !== null && state.longitude !== null) {
          return {
            type: "Point" as const,
            coordinates: [state.longitude, state.latitude] as [number, number],
          };
        }
        return null;
      },
    }),
    {
      name: "ruralsync-provider-location",
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        city: state.city,
        state: state.state,
        displayName: state.displayName,
        street: state.street,
        zipCode: state.zipCode,
      }),
    }
  )
);
