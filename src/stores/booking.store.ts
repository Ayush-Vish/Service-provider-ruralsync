import { SHOPKEEPER_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface ExtraTask {
  description: string;
  extraPrice: string;
}

interface Location {
  type: string;
  coordinates: [number, number];
}

interface Service {
  _id: string;
  name: string;
  description: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  client: Client;
  serviceProvider: string;
  service: Service;
  bookingDate: string;
  bookingTime: string;
  status: string;
  paymentStatus: string;
  extraTasks: ExtraTask[];
  location: Location;
  createdAt: string;
  updatedAt: string;
}

type BookingData = {
  bookingId:string;
  agentId:string;
}
interface BookingState {
  bookings: Booking[];
  getAllBookings: () => Promise<void>;
  assignBooking: (bookingdata: BookingData) => Promise<void>;
  getBookingDetails: (bookingId: string) => Promise<Booking>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  getAllBookings: async () => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "bookings");
      set({ bookings: res.data.bookings });
      toast.success("Bookings fetched successfully!");
    } catch (error) {
      set({ bookings: [] });
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  },
  assignBooking: async (bookingdata) => {
    try {
       await axiosInstance.post(SHOPKEEPER_BASE_URL + "assign-booking", bookingdata);
      // const data = await res.data;
      toast.success("Booking assigned successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error in assigning");
    }
  },
  getBookingDetails: async (bookingId) => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + `booking/${bookingId}`);
      return res.data.booking;
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      toast.error("Failed to fetch booking details");
      throw error;
    }
  },
}));