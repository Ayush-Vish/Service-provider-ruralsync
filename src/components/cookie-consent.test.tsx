import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CookieConsent from './cookie-consent';
import Cookies from 'js-cookie';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock js-cookie
vi.mock('js-cookie', () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
    },
}));

describe('CookieConsent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does not show dialog if cookie exists', () => {
        (Cookies.get as any).mockReturnValue('true');
        render(<CookieConsent />);
        expect(screen.queryByText('Cookie Consent')).not.toBeInTheDocument();
    });

    it('shows dialog if cookie does not exist', () => {
        (Cookies.get as any).mockReturnValue(undefined);
        render(<CookieConsent />);
        expect(screen.getByText('Cookie Consent')).toBeInTheDocument();
    });

    it('sets cookie and closes dialog on accept', async () => {
        (Cookies.get as any).mockReturnValue(undefined);
        render(<CookieConsent />);

        fireEvent.click(screen.getByText('Accept'));

        expect(Cookies.set).toHaveBeenCalledWith('cookieConsent', 'true', expect.objectContaining({ expires: 365 }));
        await waitFor(() => {
            expect(screen.queryByText('Cookie Consent')).not.toBeInTheDocument();
        });
    });

    it('sets cookie and closes dialog on decline', async () => {
        (Cookies.get as any).mockReturnValue(undefined);
        render(<CookieConsent />);

        fireEvent.click(screen.getByText('Decline'));

        expect(Cookies.set).toHaveBeenCalledWith('cookieConsent', 'false', expect.objectContaining({ expires: 365 }));
        await waitFor(() => {
            expect(screen.queryByText('Cookie Consent')).not.toBeInTheDocument();
        });
    });
});
