import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getLocation,
    reverseGeocode,
    forwardGeocode,
    searchPlaces,
    formatCoordinatesForMongoDB
} from './location';

// Mock fetch
global.fetch = vi.fn();

describe('location utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getLocation', () => {
        it('should resolve with coordinates when geolocation is supported and successful', async () => {
            const mockGeolocation = {
                getCurrentPosition: vi.fn().mockImplementation((success) =>
                    success({
                        coords: {
                            latitude: 10,
                            longitude: 20,
                        },
                    })
                ),
            };
            // @ts-ignore
            global.navigator.geolocation = mockGeolocation;

            const result = await getLocation();
            expect(result).toEqual({ latitude: 10, longitude: 20 });
        });

        it('should reject when geolocation is not supported', async () => {
            // @ts-ignore
            delete global.navigator.geolocation;

            await expect(getLocation()).rejects.toEqual({
                code: 0,
                message: 'Geolocation is not supported by your browser',
            });
        });

        it('should reject when geolocation fails', async () => {
            const mockGeolocation = {
                getCurrentPosition: vi.fn().mockImplementation((_, error) =>
                    error({
                        code: 1,
                        message: 'User denied geolocation',
                    })
                ),
            };
            // @ts-ignore
            global.navigator.geolocation = mockGeolocation;

            await expect(getLocation()).rejects.toEqual({
                code: 1,
                message: 'User denied geolocation',
            });
        });
    });

    describe('reverseGeocode', () => {
        it('should return geocoding result on success', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    address: {
                        city: 'Test City',
                        state: 'Test State',
                        country: 'Test Country',
                        road: 'Test Street',
                        postcode: '12345',
                    },
                    display_name: 'Test Display Name',
                }),
            };
            (global.fetch as any).mockResolvedValue(mockResponse);

            const result = await reverseGeocode(10, 20);
            expect(result).toEqual({
                city: 'Test City',
                state: 'Test State',
                country: 'Test Country',
                displayName: 'Test Display Name',
                street: 'Test Street',
                zipCode: '12345',
            });
        });

        it('should return null on API failure', async () => {
            (global.fetch as any).mockResolvedValue({ ok: false });
            const result = await reverseGeocode(10, 20);
            expect(result).toBeNull();
        });

        it('should return null on fetch error', async () => {
            (global.fetch as any).mockRejectedValue(new Error('Network error'));
            const result = await reverseGeocode(10, 20);
            expect(result).toBeNull();
        });
    });

    describe('forwardGeocode', () => {
        it('should return coordinates on success', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ([{ lat: '10.5', lon: '20.5' }]),
            };
            (global.fetch as any).mockResolvedValue(mockResponse);

            const result = await forwardGeocode('Test Address');
            expect(result).toEqual({ lat: 10.5, lng: 20.5 });
        });

        it('should return null if no results found', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ([]),
            };
            (global.fetch as any).mockResolvedValue(mockResponse);

            const result = await forwardGeocode('Test Address');
            expect(result).toBeNull();
        });
    });

    describe('searchPlaces', () => {
        it('should return places on success', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ([
                    {
                        place_id: 123,
                        lat: '10',
                        lon: '20',
                        display_name: 'Place 1',
                        address: { city: 'City 1' }
                    }
                ])
            };
            (global.fetch as any).mockResolvedValue(mockResponse);

            const result = await searchPlaces('query');
            expect(result).toHaveLength(1);
            expect(result[0].displayName).toBe('Place 1');
        });

        it('should return empty array on failure', async () => {
            (global.fetch as any).mockResolvedValue({ ok: false });
            const result = await searchPlaces('query');
            expect(result).toEqual([]);
        });

        it('should return empty array for short query', async () => {
            const result = await searchPlaces('a');
            expect(result).toEqual([]);
        });
    });

    describe('formatCoordinatesForMongoDB', () => {
        it('should format correctly', () => {
            const result = formatCoordinatesForMongoDB(10, 20);
            expect(result).toEqual({
                type: 'Point',
                coordinates: [20, 10]
            });
        });
    });
});
