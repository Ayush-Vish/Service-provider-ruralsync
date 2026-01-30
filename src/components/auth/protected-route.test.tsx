import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from './protected-route';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

// Mock auth store
vi.mock('@/stores/auth.store', () => ({
    useAuthStore: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;
const Login = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
    const initialise = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        initialise.mockResolvedValue(true);
    });

    const renderWithRouter = (ui: React.ReactNode, initialEntries = ['/protected']) => {
        return render(
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/protected" element={ui} />
                    <Route path="/auth/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('shows loading state initially', () => {
        (useAuthStore as any).mockImplementation((selector: any) =>
            selector({ isLoggedIn: false, initialise })
        );

        // Mock start with loading
        // Since useEffect is async, it starts loading.
        // We can check if loader is present immediately.

        renderWithRouter(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders children if logged in', async () => {
        (useAuthStore as any).mockImplementation((selector: any) =>
            selector({ isLoggedIn: true, initialise })
        );

        renderWithRouter(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });

    it('redirects to login if not logged in after check', async () => {
        (useAuthStore as any).mockImplementation((selector: any) =>
            selector({ isLoggedIn: false, initialise })
        );

        renderWithRouter(
            <ProtectedRoute>
                <TestComponent />
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });

        expect(initialise).toHaveBeenCalled();
    });
});
