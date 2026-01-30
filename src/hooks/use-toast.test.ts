import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from './use-toast';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useToast', () => {
    beforeEach(() => {
        // Clear dismiss queue
        const { result } = renderHook(() => useToast());
        act(() => {
            result.current.toasts.forEach((t) => {
                if (t.id) result.current.dismiss(t.id)
            });
        });
    });

    it('should add a toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            toast({ title: 'Test Toast', description: 'Test Description' });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Test Toast');
    });

    it('should dismiss a toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            toast({ title: 'Test Toast' });
        });

        const toastId = result.current.toasts[0].id;

        act(() => {
            result.current.dismiss(toastId);
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it('should limit the number of toasts', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            toast({ title: 'Toast 1' });
            toast({ title: 'Toast 2' });
        });
        // Limit is 1
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Toast 2');
    });
});
