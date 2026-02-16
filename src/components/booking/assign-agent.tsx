import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAgentStore } from "@/stores/agent.store";
import { UserPlus, X, Shield, Wrench, Users } from "lucide-react";

type AgentAssignmentModalProps = {
  bookingId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assignAgent: (bookingId: string, agentId: string, role?: string) => void;
  currentAgents?: { agent: { _id: string; name: string; status: string }; role: string }[];
  onRemoveAgent?: (bookingId: string, agentId: string) => void;
};

type AgentStatus = "BUSY" | "FREE" | "OFFLINE";

const roleOptions = [
  { value: 'PRIMARY', label: 'Primary Agent', icon: Shield, color: 'text-blue-600' },
  { value: 'SUPPORT', label: 'Support Agent', icon: Wrench, color: 'text-amber-600' },
  { value: 'ASSISTANT', label: 'Assistant', icon: Users, color: 'text-emerald-600' },
];

export default function AgentAssignmentModal({
  bookingId,
  isOpen,
  setIsOpen,
  assignAgent,
  currentAgents = [],
  onRemoveAgent
}: AgentAssignmentModalProps) {
  const agents = useAgentStore((state) => state.agents);
  const getAllAgents = useAgentStore((state) => state.getAllAgents);
  const [selectedAgent, setSelectedAgent] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>('PRIMARY');

  useEffect(() => {
    if (isOpen) {
      getAllAgents();
    }
  }, [isOpen, getAllAgents]);

  const handleAssign = () => {
    if (selectedAgent) {
      assignAgent(bookingId, selectedAgent, selectedRole);
      setSelectedAgent(undefined);
      setSelectedRole('PRIMARY');
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "FREE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "BUSY": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "OFFLINE": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDot = (status: AgentStatus) => {
    switch (status) {
      case "FREE": return "bg-emerald-500";
      case "BUSY": return "bg-amber-500";
      case "OFFLINE": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Filter out already assigned agents
  const assignedIds = new Set(currentAgents.map(a => a.agent._id));
  const availableAgents = agents.filter(a => !assignedIds.has(a._id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            Assign Agents
          </DialogTitle>
          <DialogDescription>
            Assign multiple agents to this booking. You can add primary, support, or assistant roles.
          </DialogDescription>
        </DialogHeader>

        {/* Currently Assigned Agents */}
        {currentAgents.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Currently Assigned ({currentAgents.length})</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {currentAgents.map((assigned) => (
                <div
                  key={assigned.agent._id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {assigned.agent.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{assigned.agent.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {assigned.role}
                        </Badge>
                        <Badge className={`text-[10px] px-1.5 py-0 ${getStatusColor(assigned.agent.status as AgentStatus)}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(assigned.agent.status as AgentStatus)}`} />
                          {assigned.agent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {onRemoveAgent && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveAgent(bookingId, assigned.agent._id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Agent */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-muted-foreground">Add Agent</p>

          {/* Agent Selection */}
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an agent..." />
            </SelectTrigger>
            <SelectContent>
              {availableAgents.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No available agents
                </div>
              ) : (
                availableAgents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusDot(agent.status as AgentStatus)}`} />
                      <span>{agent.name}</span>
                      <span className="text-muted-foreground text-xs">({agent.status})</span>
                      {agent.services && agent.services.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          - {agent.services.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Role Selection */}
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(({ value, label, icon: Icon, color }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleAssign}
            className="w-full"
            disabled={!selectedAgent}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
