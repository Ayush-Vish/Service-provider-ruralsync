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

interface AssignedAgent {
  agent: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    status: string;
  };
  assignedAt: string;
  role: string;
}

interface AgentLocationData {
  coordinates: [number, number];
  heading?: number;
  speed?: number;
  accuracy?: number;
  lastUpdated: string;
  isActive: boolean;
}

interface AgentWithLocation {
  // Flat fields (returned directly by the API tracking endpoint)
  _id: string;
  name: string;
  phoneNumber?: string;
  profileImage?: string;
  status?: string;
  // Nested agent object (populated variant)
  agent?: {
    _id: string;
    name: string;
    phoneNumber?: string;
    profileImage?: string;
    status: string;
  };
  assignedAt?: string;
  role: string;
  location: AgentLocationData | null;
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
  address?: string;
  assignedAgents?: AssignedAgent[];
  assignedAgent?: {
    _id: string;
    name: string;
    phoneNumber?: string;
    email?: string;
  };
  liveTrackingEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

type BookingData = {
  bookingId: string;
  agentId: string;
  role?: string;
}
interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  trackingData: { booking: any; agents: AgentWithLocation[] } | null;
  isTrackingLoading: boolean;
  getAllBookings: () => Promise<void>;
  assignBooking: (bookingdata: BookingData) => Promise<void>;
  removeAgentFromBooking: (bookingId: string, agentId: string) => Promise<void>;
  getBookingDetails: (bookingId: string) => Promise<Booking>;
  getBookingAgentsWithLocations: (bookingId: string) => Promise<void>;
  getAgentLocation: (bookingId: string, agentId: string) => Promise<any>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,
  trackingData: null,
  isTrackingLoading: false,

  getAllBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "bookings");
      set({ bookings: res.data.data, isLoading: false, error: null });
    } catch (error) {
      set({ bookings: [], isLoading: false, error: "Failed to fetch bookings" });
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  },

  assignBooking: async (bookingdata) => {
    try {
      await axiosInstance.post(SHOPKEEPER_BASE_URL + "assign-booking", bookingdata);
      toast.success("Agent assigned successfully");
      // Re-fetch bookings to get updated data
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "bookings");
      set({ bookings: res.data.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error in assigning");
    }
  },

  removeAgentFromBooking: async (bookingId, agentId) => {
    try {
      await axiosInstance.post(SHOPKEEPER_BASE_URL + "remove-agent", { bookingId, agentId });
      toast.success("Agent removed successfully");
      // Re-fetch bookings
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "bookings");
      set({ bookings: res.data.data });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error removing agent");
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

  getBookingAgentsWithLocations: async (bookingId) => {
    try {
      set({ isTrackingLoading: true });
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + `bookings/${bookingId}/agents`);
      set({ trackingData: res.data.data, isTrackingLoading: false });
    } catch (error) {
      console.error("Failed to fetch agent locations:", error);
      set({ isTrackingLoading: false });
      toast.error("Failed to fetch tracking data");
    }
  },

  getAgentLocation: async (bookingId, agentId) => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + `bookings/${bookingId}/agents/${agentId}/location`);
      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch agent location:", error);
      return null;
    }
  },
}));
