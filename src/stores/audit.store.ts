/* eslint-disable @typescript-eslint/no-explicit-any */

import { AUDIT_LOGS_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface AuditState {
      logs: any[];
      loading: boolean;
      error: any;
      fetchAuditLogs: () => void;
}


const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  loading: false,
  error: null,

  fetchAuditLogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get( AUDIT_LOGS_BASE_URL);
      set({ logs: response.data.data, loading: false });
    } catch (error) {
      toast.error('Failed to fetch audit logs');
      console.log(error)
    }
  },
}));

export default useAuditStore;
