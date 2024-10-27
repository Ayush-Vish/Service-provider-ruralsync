import { SHOPKEEPER_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type Service = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  category: string;
  availability: { day: string; startTime: string; endTime: string }[];
  additionalTasks: {
    description: string;
    extraPrice: number;
    timeAdded?: string;
  }[];
  location: { coordinates: [number, number] };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags: string[];
};

interface ServiceState {
  services: Service[];
  addService: (service: Service) => void;
  getServices: () => void;
  deleteService: (id: string) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  addService: async (service) => {
    try {
      const res = await axiosInstance.post(SHOPKEEPER_BASE_URL + "add-new-service", service);
      if (res.status !== 201) {
        toast.error("Failed to add service");
        return;
      }
      const data = await res.data;
      console.log(data);
      set((state) => ({ services: [...state.services, data] }));
      toast.success("Service added successfully");
    } catch (error) {
      toast.error("Failed to add service " + error.message);
    }
  },
  getServices: async () => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "services");
      console.log(await res.data.data)
      set({ services: await res.data.data });

    } catch (error) {
      set({ services: [] });
      toast.error("Failed to fetch services");
    }
  }, 
  deleteService: async (id) => {
    try {
      console.log(id)
      const res = await axiosInstance.delete(SHOPKEEPER_BASE_URL + `delete-service/${id}`);
      if (res.status !== 200) {
        toast.error("Failed to delete service");
        return;
      }
      set((state) => ({ services: state.services.filter((service) => service.id !== id) }));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error("Failed to delete service " + error.message);
    }

  }
}));