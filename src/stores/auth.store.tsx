import { AUTH_BASE_URL } from '@/constants';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  setAuth: (token: string) => void;
  login: (loginData: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set , get ) => ({
  isAuthenticated: false,
  token: null,
  
  user: null,
  setAuth: (token) => set({ isAuthenticated: true, token }),
  login: async (loginData) => {
    try {
      const res = await fetch(AUTH_BASE_URL + "/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        toast.error("Register failed")
        return;
      }

      const data = await res.json();
      toast.success("Registered Successfully ");
    } catch (error) {
      console.error('Login error:', error);
     
    }
  },
  logout: () => set({ isAuthenticated: false, token: null, user: null }),
}));