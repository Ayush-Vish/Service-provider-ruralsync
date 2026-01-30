import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { describe, it, expect } from 'vitest';

describe('Label', () => {
    it('renders correctly', () => {
        render(<Label htmlFor="test-input">Test Label</Label>);
        const label = screen.getByText('Test Label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'test-input');
    });

    it('applies custom classes', () => {
        render(<Label className="custom-class">Test Label</Label>);
        const label = screen.getByText('Test Label');
        expect(label).toHaveClass('custom-class');
    });
});
