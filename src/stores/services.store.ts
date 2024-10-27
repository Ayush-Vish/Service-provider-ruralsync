import { SHOPKEEPER_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ServiceState {
  services: Service[];
  addService: (service: Service) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  addService: async(service) =>{
    try {
      const res= await axiosInstance.post(SHOPKEEPER_BASE_URL + "add-new-service" , service);
      if(res.status !== 201){
        toast.error("Failed to add service");
        return;
      }
      const data = await res.data()
      set((state) => ({ services: [...state.services, data] }));
      toast.success("Service added successfully");

    } catch (error) {
      toast.error("Failed to add service "  + error.message);
    }
  },
  getServices: async () => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "services");
      set({ services: res.data });
    } catch (error) {
      toast.error("Failed to fetch services");
    }
  }
  
}));
