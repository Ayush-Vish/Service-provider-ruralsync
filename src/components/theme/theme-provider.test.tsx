import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './theme-provider';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const TestComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <p>Current Theme: {theme}</p>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('light')}>Set Light</button>
        </div>
    );
};

describe('ThemeProvider', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        localStorage.clear();
        document.documentElement.className = '';
    });

    it('renders children and provides default theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByText('Current Theme: system')).toBeInTheDocument();
    });

    it('changes theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const button = screen.getByText('Set Dark');
        act(() => {
            button.click();
        });

        expect(screen.getByText('Current Theme: dark')).toBeInTheDocument();
        expect(localStorage.getItem('ruralsync-theme')).toBe('dark');
        expect(document.documentElement).toHaveClass('dark');
    });

    it('uses stored theme', () => {
        localStorage.setItem('ruralsync-theme', 'light');
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByText('Current Theme: light')).toBeInTheDocument();
        expect(document.documentElement).toHaveClass('light');
    });

    it('handles system theme', () => {
        // Mock matchMedia for dark mode
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        render(
            <ThemeProvider defaultTheme="system">
                <TestComponent />
            </ThemeProvider>
        );

        expect(document.documentElement).toHaveClass('dark');
    });
});
