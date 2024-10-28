import { BusinessHours } from '@/components/org/regeister-org';
import { SHOPKEEPER_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type OrganizationData = {
  orgName: string;
  phone: string;
  address: string;
  description: string;
  website: string;
  logo: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  businessHours: BusinessHours[];
  isVerified?: boolean;
};

interface OrgState {
  orgDetails: OrganizationData | null;
  setOrgDetails: (details: OrganizationData) => void;
  getOrgDetails: () => Promise<boolean>;
  registerOrg: (orgData: OrganizationData) => Promise<boolean>;
}

export const useOrgStore = create<OrgState>((set) => ({
  orgDetails: null,
  getOrgDetails: async () => {
    try {
      const res = await axiosInstance.get(`${SHOPKEEPER_BASE_URL}/org-detail`);
      set({ orgDetails: res.data });
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch organization details");
      return false;
    }
  },
  registerOrg: async (orgData) => {
    try {
      const res = await axiosInstance.post(`${SHOPKEEPER_BASE_URL}/register-org`, orgData);
      set({ orgDetails: res.data });
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to register organization");
      return false;
    }
  },
  setOrgDetails: (details) => set({ orgDetails: details }),
}));