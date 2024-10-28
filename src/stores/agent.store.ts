import { AUTH_BASE_URL, SHOPKEEPER_BASE_URL } from "@/constants";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface Agent {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  services: string[];
  password:string;
  serviceArea: string;
  serviceProviderId?: string;
  status?: string[];
  latitude?:number;
  longitude?:number;
  rating?: number;
  feedback?: string[];
  currentBookings?: string[];
  completedBookings?: string[];
}

interface AgentState {
  agents: Agent[];
  currAgent:Agent | null;
  registerAgent: (agent: Agent) => Promise<void>;
  getAllAgents: () => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgent:(id :string) => Promise<void>;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  currAgent:null,
  
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
      toast.error("Failed to add agent: " + error.message);
      console.error(error);
    }
  },

  getAllAgents: async () => {
    try {
      const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + "all-agents");
      if (res.status !== 200) {
        toast.error("Failed to fetch agents");
        return;
      }
      const data = res.data;
      console.log(data)
      set({ agents: data.data });
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
      toast.error("Failed to delete agent: " + error.message);
      console.error(error);
    }
  },
  getAgent : async(id ) => {
      try {
        const res = await axiosInstance.get(SHOPKEEPER_BASE_URL + 'agent/' + id);
        const data = await res.data.agent;

        console.log(data);
        set((state)=> state.currAgent = data)

      } catch (error) {
        console.log(error)
      }
  }
}));
