import { AUTH_BASE_URL, SHOPKEEPER_BASE_URL } from '@/constants';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  status : "BUSY" | "FREE"  | "OFFLINE"
  location: {
    latitude: number;
    longitude: number;
  };
  services: string[];
  serviceArea: string;
  feedback?: string[];
  currentBookings?: string[];
  completedBookings?: string[];
}

interface AgentState {
  agents: Agent[];
  currAgent: Agent | null;
  registerAgent: (agent: Omit<Agent, "_id">   ) => Promise<void>;
  getAllAgents: () => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgent: (id: string) => Promise<void>;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  currAgent: null,

  registerAgent: async (agentInfo) => {
    try {
      const res = await axiosInstance.post(AUTH_BASE_URL + "agent-register", agentInfo);
      if (res.status !== 201) {
        toast.error("Failed to add agent");
        return;
      }
      const data = res.data;
      set((state) => ({ agents: [...state.agents, data] }));
      toast.success("Agent added successfully");
    } catch (error) {
      toast.error("Failed to add agent: " );
      console.error(error);
    }
  },

  getAllAgents: async () => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "all-agents");
      set({ agents: res.data.data });
      toast.success("Agents fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch agents");
      console.error(error);
    }
  },

  deleteAgent: async (id) => {
    try {
      const res = await axiosInstance.delete(SHOPKEEPER_BASE_URL + `agent/${id}`);
      if (res.status !== 200) {
        toast.error("Failed to delete agent");
        return;
      }
      set((state) => ({
        agents: state.agents.filter((agent) => agent._id !== id),
      }));
      toast.success("Agent deleted successfully");
    } catch (error) {
      toast.error("Failed to delete agent: " );
      console.error(error);
    }
  },

  getAgent: async (id) => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + `agent/${id}`);
      set({ currAgent: res.data.agent });
    } catch (error) {
      toast.error("Failed to fetch agent details");
      console.error(error);
    }
  },
}));