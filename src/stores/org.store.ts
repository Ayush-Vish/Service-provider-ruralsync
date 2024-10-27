import { create } from 'zustand';

interface OrgState {
  orgDetails: any;
  setOrgDetails: (details: any) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  orgDetails: null,
  setOrgDetails: (details) => set({ orgDetails: details }),
}));
