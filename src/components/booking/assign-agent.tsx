import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgentStore } from "@/stores/agent.store";

type AgentAssignmentModalProps = {
  bookingId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assignAgent: (bookingId: string, agentId: string) => void;
};

// Define a type for agent status
type AgentStatus ="BUSY" | "FREE" | "OFFLINE"

export default function AgentAssignmentModal({ bookingId, isOpen, setIsOpen, assignAgent }: AgentAssignmentModalProps) {
  const agents = useAgentStore((state) => state.agents);
  const getAllAgents = useAgentStore((state) => state.getAllAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>(null);

  useEffect(() => {
    if (isOpen) {
      getAllAgents();
    }
  }, [isOpen, getAllAgents]);

  const handleAssign = () => {
    if (selectedAgent) {
      assignAgent(bookingId, selectedAgent);
      setIsOpen(false);
    }
  };

  // Function to get the color based on the agent's status
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "FREE":
        return "text-green-500"; // Green for available
      case "BUSY":
        return "text-yellow-500"; // Yellow for busy
      case "OFFLINE":
        return "text-red-500"; // Red for offline
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id}>
                  <div className="flex items-center">
                    {agent.name}
                    {/* Displaying the status with color */}
                    <span className={`ml-2 ${getStatusColor(agent.status)}`}>
                      ({agent.status})
                    </span>
                    {/* Displaying services directly in the select option */}
                    {agent.services && agent.services.length > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({agent.services.map(service => service).join(', ')})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAssign} className="w-full">
            Assign Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
