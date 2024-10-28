import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Agent, useAgentStore } from "@/stores/agent.store";

type AgentDetailsDialogProps = {
  agentId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AgentDetailsDialog({ agentId, isOpen, setIsOpen }: AgentDetailsDialogProps) {
  const currAgent = useAgentStore((state) => state.currAgent);
  const getAgent = useAgentStore((state) => state.getAgent);

  useEffect(() => {
    if (isOpen) {
      getAgent(agentId);
    }
  }, [isOpen, agentId, getAgent]);

  return currAgent && (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agent Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Name:</strong> {currAgent.name}</p>
          <p><strong>Email:</strong> {currAgent.email}</p>
          <p><strong>Phone:</strong> {currAgent.phoneNumber}</p>
          <p><strong>Services:</strong> {currAgent.services?.join(", ") || "N/A"}</p>
          <p><strong>Service Area:</strong> {currAgent.serviceArea}</p>
          <p><strong>Rating:</strong> {currAgent.rating}</p>
          <p><strong>Feedback:</strong> {currAgent.feedback?.join(", ") || "N/A"}</p>
          <p><strong>Current Bookings:</strong> {currAgent.currentBookings?.join(", ") || "N/A"}</p>
          <p><strong>Completed Bookings:</strong> {currAgent.completedBookings?.join(", ") || "N/A"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}