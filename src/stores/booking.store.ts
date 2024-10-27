import { create } from 'zustand';

interface Booking {
  id: string;
  serviceId: string;
  agentId?: string;
  customer: string;
  status: string;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  assignAgentToBooking: (bookingId: string, agentId: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  assignAgentToBooking: (bookingId, agentId) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, agentId } : booking
      ),
    })),
}));
