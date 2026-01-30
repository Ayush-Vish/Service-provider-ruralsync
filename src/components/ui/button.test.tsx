import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders with variants', () => {
        render(<Button variant="destructive">Destructive</Button>);
        const button = screen.getByRole('button', { name: /destructive/i });
        expect(button).toHaveClass('bg-destructive');
    });

    it('renders as child with asChild prop', () => {
        render(<Button asChild><a href="/">Link</a></Button>);
        const link = screen.getByRole('link', { name: /link/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
        // It should still look like a button class-wise
        expect(link).toHaveClass('inline-flex');
    });
});
