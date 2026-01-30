import { render, screen, fireEvent } from '@testing-library/react';
import SidebarMenuComponent from './sidebar-menu';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useOrgStore } from '@/stores/org.store';
import { useAuthStore } from '@/stores/auth.store';

// Mock stores
vi.mock('@/stores/org.store', () => ({
    useOrgStore: vi.fn(),
}));

vi.mock('@/stores/auth.store', () => ({
    useAuthStore: vi.fn(),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock sidebar components because they might rely on context
vi.mock('@/components/ui/sidebar', () => {
    const FakeSidebar = ({ children }: any) => <div>{children}</div>;
    return {
        Sidebar: FakeSidebar,
        SidebarContent: FakeSidebar,
        SidebarHeader: FakeSidebar,
        SidebarMenu: FakeSidebar,
        SidebarMenuItem: FakeSidebar,
        SidebarMenuButton: ({ children, onClick, className }: any) => (
            <button onClick={onClick} className={className}>{children}</button>
        ),
        SidebarFooter: FakeSidebar,
    };
});

describe('SidebarMenuComponent', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockImplementation((selector: any) => selector({ logout: mockLogout }));
        (useOrgStore as any).mockImplementation((selector: any) => selector({ orgDetails: { name: 'Test Org' } }));
    });

    const renderComponent = (onSectionChange = vi.fn()) => {
        return render(
            <BrowserRouter>
                <SidebarMenuComponent onSectionChange={onSectionChange} />
            </BrowserRouter>
        );
    };

    it('renders organization name', () => {
        renderComponent();
        expect(screen.getByText('Test Org')).toBeInTheDocument();
    });

    it('renders default title if no org details', () => {
        (useOrgStore as any).mockImplementation((selector: any) => selector({ orgDetails: null }));
        renderComponent();
        expect(screen.getByText('Service Provider Dashboard')).toBeInTheDocument();
    });

    it('calls onSectionChange when menu items are clicked', () => {
        const handleSectionChange = vi.fn();
        renderComponent(handleSectionChange);

        fireEvent.click(screen.getByText('Dashboard'));
        expect(handleSectionChange).toHaveBeenCalledWith('dashboard');

        fireEvent.click(screen.getByText('Services'));
        expect(handleSectionChange).toHaveBeenCalledWith('services');
    });

    it('handles logout', async () => {
        renderComponent();
        fireEvent.click(screen.getByText('Logout'));

        expect(mockLogout).toHaveBeenCalled();
        // Since logout is async, we await
        await new Promise(process.nextTick);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
