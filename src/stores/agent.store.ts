import { create } from 'zustand';

interface Agent {
  id: string;
  name: string;
}

interface AgentState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  availableAgents: Agent[];
  setAvailableAgents: (agents: Agent[]) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  availableAgents: [],
  setAvailableAgents: (agents) => set({ availableAgents: agents }),
}));
