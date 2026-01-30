import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageUpload from './uploadImage';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock createObjectURL/revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test');
global.URL.revokeObjectURL = vi.fn();

describe('ImageUpload', () => {
    const handleChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<ImageUpload label="Upload Image" onChange={handleChange} value={[]} />);
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
        expect(screen.getByText('Choose File')).toBeInTheDocument();
    });

    it('handles file selection', async () => {
        render(<ImageUpload label="Upload" onChange={handleChange} value={[]} />);

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const input = screen.getByLabelText('Upload') as HTMLInputElement; // The input is hidden but linked by label? Check component. 
        // Component uses explicit ID and button to click it. 
        // Input has id={`file-upload-${label}`}.

        const fileInput = document.getElementById('file-upload-Upload') as HTMLInputElement;

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(handleChange).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('displays previews', () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        render(<ImageUpload label="Upload" onChange={handleChange} value={[file]} />);

        expect(screen.getByText('test.png')).toBeInTheDocument();
        expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
    });

    it('removes file', () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        // We need to trigger the removal. 
        // Note: the component maintains internal state for previews but takes value from props.
        // If we only pass value prop, internal preview state might be empty if we don't trigger change.
        // Actually looking at component: 
        // `src={previews[index] || URL.createObjectURL(file)}` 
        // So passing value prop works for display.

        render(<ImageUpload label="Upload" onChange={handleChange} value={[file]} />);

        const removeButton = screen.getByRole('button', { name: '' }); // It has an icon, maybe X
        // The button has variant="destructive".

        // Find by class or icon presence
        const cards = screen.getAllByText('test.png');
        // The button is inside the card.
        // Let's use queries more specific.

        // The close button
        const buttons = screen.getAllByRole('button');
        // Filter for the one in card (index 1 probably, 0 is choose file)
        const deleteBtn = buttons[1];

        fireEvent.click(deleteBtn);

        expect(handleChange).toHaveBeenCalledWith([]);
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
});
