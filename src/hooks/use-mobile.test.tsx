import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useIsMobile', () => {
    let matchMediaMock: any;

    beforeEach(() => {
        matchMediaMock = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));
        window.matchMedia = matchMediaMock;
    });

    it('should return false when width is larger than breakpoint', () => {
        window.innerWidth = 1024;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('should return true when width is smaller than breakpoint', () => {
        window.innerWidth = 500;
        // We also need to make sure matchMedia returns matches: true for the query
        matchMediaMock.mockImplementation((query: string) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });
});
