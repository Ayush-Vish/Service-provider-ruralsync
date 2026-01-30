import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from './toggle';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTheme } from '@/dark-mode';

// Mock useTheme
vi.mock('@/dark-mode', () => ({
    useTheme: vi.fn(),
}));

describe('ModeToggle', () => {
    const setTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTheme as any).mockReturnValue({ setTheme });
    });

    it('renders toggle button', () => {
        render(<ModeToggle />);
        expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });

    it('opens menu and changes theme', async () => {
        render(<ModeToggle />);

        // Open dropdown (radix UI trigger)
        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Check for options
        expect(await screen.findByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();

        // Click option
        fireEvent.click(screen.getByText('Dark'));
        expect(setTheme).toHaveBeenCalledWith('dark');
    });
});
