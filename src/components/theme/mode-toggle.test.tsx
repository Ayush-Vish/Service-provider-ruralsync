import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from './mode-toggle';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTheme } from './theme-provider';

// Mock useTheme
vi.mock('./theme-provider', () => ({
    useTheme: vi.fn(),
}));

describe('ModeToggle (Theme)', () => {
    const setTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTheme as any).mockReturnValue({ setTheme, theme: 'light' });
    });

    it('renders toggle button', () => {
        render(<ModeToggle />);
        expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });

    it('opens menu and changes theme', async () => {
        render(<ModeToggle />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(await screen.findByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Dark'));
        expect(setTheme).toHaveBeenCalledWith('dark');
    });
});
