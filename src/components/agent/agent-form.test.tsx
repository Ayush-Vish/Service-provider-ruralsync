import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentForm from './agent-form';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAgentStore } from '@/stores/agent.store';
import useLocation from '@/hooks/useLocation';

// Mock store
vi.mock('@/stores/agent.store', () => ({
    useAgentStore: vi.fn(),
}));

// Mock custom hook
vi.mock('@/hooks/useLocation', () => ({
    default: vi.fn(),
}));

describe('AgentForm', () => {
    const registerAgent = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAgentStore as any).mockImplementation((selector: any) => selector({ registerAgent }));
        (useLocation as any).mockReturnValue({ location: { latitude: 10, longitude: 20 }, error: null });
    });

    it('renders trigger button', () => {
        render(<AgentForm />);
        expect(screen.getByText('Add New Agent')).toBeInTheDocument();
    });

    it('opens dialog and renders form', async () => {
        render(<AgentForm />);
        fireEvent.click(screen.getByText('Add New Agent'));

        await waitFor(() => {
            expect(screen.getByText('Add New Agent', { selector: 'h2' })).toBeInTheDocument(); // Dialog Title
        });

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('fills form and submits', async () => {
        registerAgent.mockResolvedValue({});
        render(<AgentForm />);

        fireEvent.click(screen.getByText('Add New Agent'));

        await waitFor(() => {
            expect(screen.getByLabelText('Name')).toBeVisible();
        });

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });

        // Select service
        fireEvent.click(screen.getByText('Plumbing'));

        fireEvent.click(screen.getByText('Save Agent'));

        await waitFor(() => {
            expect(registerAgent).toHaveBeenCalledWith(expect.objectContaining({
                name: 'John Doe',
                email: 'john@example.com',
                services: ['plumbing'],
                location: { latitude: 10, longitude: 20 }
            }));
        });
    });

    it('shows location error alert', () => {
        (useLocation as any).mockReturnValue({ location: null, error: { message: 'Location Access Denied' } });
        render(<AgentForm />);
        fireEvent.click(screen.getByText('Add New Agent'));

        expect(screen.getByText('Location Access Denied')).toBeInTheDocument();
    });
});
