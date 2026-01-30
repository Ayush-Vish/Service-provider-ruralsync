import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Services from './services';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useServiceStore } from '@/stores/services.store';
import useLocation from '@/hooks/useLocation';

// Mock stores
vi.mock('@/stores/services.store', () => ({
    useServiceStore: vi.fn(),
}));

// Mock hooks
vi.mock('@/hooks/useLocation', () => ({
    default: vi.fn(),
}));

// Mock sub-components
vi.mock('./service-table', () => ({
    default: () => <div>Service Table</div>,
}));

vi.mock('./service-form', () => ({
    default: ({ isAddingService, setIsAddingService }: any) => (
        isAddingService ? (
            <div>
                <button onClick={() => setIsAddingService(false)}>Close Form</button>
                Mock Service Form
            </div>
        ) : <button onClick={() => setIsAddingService(true)}>Add New Service Trigger</button>
    )
}));

describe('Services Page', () => {
    const mockGetServices = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useServiceStore as any).mockImplementation((selector: any) => selector({
            services: [],
            getServices: mockGetServices,
            deleteService: vi.fn(),
            addService: vi.fn(),
        }));
        (useLocation as any).mockReturnValue({ location: null, error: null });
    });

    it('renders services and fetches data', () => {
        render(<Services />);
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(mockGetServices).toHaveBeenCalled();
    });

    it('toggles add service form', () => {
        render(<Services />);
        // Initial state: not adding
        // Since we mocked ServiceForm to show trigger when closed:
        /*
           Wait, Services.tsx renders ServiceForm regardless?
           <ServiceForm ... isAddingService={isAddingService} ... />
           Inside ServiceForm, it renders Dialog "open={isAddingService}".
           If I mock ServiceForm entirely, I must handle the open state logic myself or inspect props.
           
           My mock:
           default: ({ isAddingService, setIsAddingService }: any) => ( ... )

           In Services.tsx:
           <ServiceForm ... />
           
           So my mock is rendered.
           If isAddingService is false (default), my mock shows "Add New Service Trigger"?
           Wait, the real ServiceForm has the trigger inside.
           Services.tsx passes isAddingService state.
        */

        // Actually, Services.tsx renders:
        // <ServiceForm ... isAddingService={isAddingService} setIsAddingService={setIsAddingService} ... />
        // And isAddingService starts as false.

        // If my mock respects props:
        // Render: <Services />
        // MyMock received isAddingService=false.
        // It renders <button>Add New Service Trigger</button> (from my mock implementation above).

        const trigger = screen.getByText('Add New Service Trigger');
        fireEvent.click(trigger);

        // Now setIsAddingService(true) called. Re-render.
        // MyMock should show "Mock Service Form".

        expect(screen.getByText('Mock Service Form')).toBeInTheDocument();
    });
});
