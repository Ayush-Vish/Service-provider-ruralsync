// Geocoding utilities using OpenStreetMap Nominatim API (100% free, no API key required)

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "RuralSync-Provider/1.0 (https://ruralsync.vercel.app)";

export interface GeocodingResult {
  city: string;
  state: string;
  country: string;
  displayName: string;
  street?: string;
  zipCode?: string;
}

export interface PlaceResult {
  placeId: string;
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  state: string;
  country: string;
  type: string;
  street?: string;
  zipCode?: string;
}

export type Position = {
  latitude: number;
  longitude: number;
};

export type LocationError = {
  code: number;
  message: string;
};

// Get current position using browser Geolocation API
export const getLocation = (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: error.message,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  });
};

// Reverse geocode coordinates to get address details
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    const address = data.address;

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state_district ||
      "";

    return {
      city,
      state: address.state || "",
      country: address.country || "",
      displayName: data.display_name || "",
      street: address.road || address.street || "",
      zipCode: address.postcode || "",
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

// Forward geocode address to coordinates
export async function forwardGeocode(
  address: string,
  countryCode: string = "in"
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=${countryCode}&limit=1&addressdetails=1`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Forward geocoding error:", error);
    return null;
  }
}

// Search places with autocomplete
export async function searchPlaces(
  query: string,
  options: {
    limit?: number;
    countryCode?: string;
  } = {}
): Promise<PlaceResult[]> {
  const { limit = 5, countryCode = "in" } = options;

  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=${countryCode}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const data = await response.json();

    return data.map((item: any) => {
      const address = item.address || {};
      return {
        placeId: item.place_id?.toString() || `${item.lat}-${item.lon}`,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          "",
        state: address.state || "",
        country: address.country || "",
        type: item.type || "place",
        street: address.road || address.street || "",
        zipCode: address.postcode || "",
      };
    });
  } catch (error) {
    console.error("Place search error:", error);
    return [];
  }
}

// Format coordinates for MongoDB GeoJSON
export function formatCoordinatesForMongoDB(
  lat: number,
  lng: number
): { type: "Point"; coordinates: [number, number] } {
  return {
    type: "Point",
    coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
  };
}
