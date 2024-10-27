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
  setServices: (services: Service[]) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  addService: (service) => set((state) => ({ services: [...state.services, service] })),
  setServices: (services) => set({ services }),
}));
