import { renderHook, act, waitFor } from '@testing-library/react';
import useLocation from './useLocation'; // Correct import
import { useLocationStore } from '@/stores/location.store';
import { getLocation, reverseGeocode } from '@/lib/location';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/stores/location.store', () => ({
    useLocationStore: vi.fn(),
}));

vi.mock('@/lib/location', () => ({
    getLocation: vi.fn(),
    reverseGeocode: vi.fn(),
}));

describe('useLocation', () => {
    let mockStore: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Default store state
        mockStore = {
            latitude: null,
            longitude: null,
            city: null,
            state: null,
            displayName: null,
            street: null,
            zipCode: null,
            isDetecting: false,
            error: null,
            setLocation: vi.fn(),
            setDetecting: vi.fn(),
            setError: vi.fn(),
            hasLocation: vi.fn(() => false),
            getCoordinates: vi.fn(),
            getAddressObject: vi.fn(),
            getMongoDBLocation: vi.fn(),
        };

        (useLocationStore as any).mockReturnValue(mockStore);
    });

    it('should return initial state', () => {
        const { result } = renderHook(() => useLocation());

        expect(result.current.latitude).toBeNull();
        expect(result.current.isDetecting).toBe(false);
    });

    it('should detect location on mount if not set', async () => {
        // Setup mocks for successful detection
        (getLocation as any).mockResolvedValue({ latitude: 10, longitude: 20 });
        (reverseGeocode as any).mockResolvedValue({
            city: 'City',
            state: 'State',
            displayName: 'Display Name',
            street: 'Street',
            zipCode: '12345'
        });

        renderHook(() => useLocation());

        // Wait for effects
        await waitFor(() => {
            expect(mockStore.setDetecting).toHaveBeenCalledWith(true);
        });
        expect(getLocation).toHaveBeenCalled();
        expect(reverseGeocode).toHaveBeenCalledWith(10, 20);
        expect(mockStore.setLocation).toHaveBeenCalledWith({
            latitude: 10,
            longitude: 20,
            city: 'City',
            state: 'State',
            displayName: 'Display Name',
            street: 'Street',
            zipCode: '12345'
        });
        expect(mockStore.setDetecting).toHaveBeenCalledWith(false);
    });

    it('should handle location detection errors', async () => {
        (getLocation as any).mockRejectedValue({ code: 1, message: 'Denied' });

        renderHook(() => useLocation());

        await waitFor(() => {
            expect(mockStore.setError).toHaveBeenCalledWith('Denied');
        });
    });
});
