// src/types/org.types.ts

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type BusinessHour =
  | { start: string; end: string }
  | "Closed";

export type SocialMedia = Partial<{
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}>;

export interface OrganizationAPI {
  name: string;
  phone: string;
  address: string;
  description: string;

  website?: string;
  logo?: string;
  images?: string[];

  socialMedia?: SocialMedia;
  categories?: string[];

  businessHours?: Record<Day, BusinessHour>;

  location?: {
    coordinates: [longitude: number, latitude: number];
  };

  isVerified: boolean;

  agentCount: number;
  serviceCount: number;
  clients: number;

  reviewCount: number;
  rating: number;

  createdAt: string;
  updatedAt: string;
}
// src/stores/org.store.ts

import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { SHOPKEEPER_BASE_URL } from "@/constants";

interface OrgState {
  orgDetails: OrganizationAPI | null;
  isLoading: boolean;
  setOrgDetails: (details: OrganizationAPI) => void;
  getOrgDetails: () => Promise<boolean>;
  registerOrg: (orgData: FormData) => Promise<boolean>;
  updateOrg: (orgData: Partial<OrganizationAPI>) => Promise<boolean>;
}

// Default state for unregistered organization
const defaultUnverifiedOrg: OrganizationAPI = {
  name: "",
  phone: "",
  address: "",
  description: "",
  isVerified: false,
  agentCount: 0,
  serviceCount: 0,
  clients: 0,
  reviewCount: 0,
  rating: 0,
  createdAt: "",
  updatedAt: "",
};

export const useOrgStore = create<OrgState>((set) => ({
  orgDetails: null,
  isLoading: false,

  setOrgDetails: (details) => set({ orgDetails: details }),

  getOrgDetails: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `${SHOPKEEPER_BASE_URL}org-detail`
      );
      const data = await res.data;
      console.log("data => " , data.data);

      set({ orgDetails: data.data, isLoading: false });
      console.log("useOrgStore => " , useOrgStore.getState().orgDetails);
      return true;
    } catch (error: any) {
      console.error(error);
      // If 404, it means org is not registered yet - set default unverified state
      if (error?.response?.status === 404) {
        set({ orgDetails: defaultUnverifiedOrg, isLoading: false });
        return true;
      }
      toast.error("Failed to fetch organization details");
      set({ isLoading: false });
      return false;
    }
  },

  registerOrg: async (orgData) => {
    try {
      const res = await axiosInstance.post<OrganizationAPI>(
        `${SHOPKEEPER_BASE_URL}register-org`,
        orgData
      );

      set({ orgDetails: res.data });
      toast.success("Organization registered successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to register organization");
      return false;
    }
  },

  updateOrg: async (orgData) => {
    try {
      const res = await axiosInstance.put<{ data: OrganizationAPI }>(
        `${SHOPKEEPER_BASE_URL}org-update`,
        orgData
      );
      set({ orgDetails: res.data.data });
      toast.success("Organization updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update organization");
      return false;
    }
  },
}));
