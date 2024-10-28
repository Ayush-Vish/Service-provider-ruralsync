import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import { Agent } from "@/stores/agent.store";
import AgentDetailsDialog from "./agent-detais";

interface AgentTableProps {
  agents: Agent[];
  deleteAgent: (id: string) => void;
}

export default function AgentTable({ agents, deleteAgent }: AgentTableProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedAgentId(id);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent._id}>
              <TableCell>{agent.name}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.phoneNumber}</TableCell>
              <TableCell>{agent.services   ? agent.services.join(", ") : "NA"}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2">
                  <Edit size={16} />
                </Button>
                <Button variant="outline" className="mr-2" onClick={() => handleViewDetails(agent._id!)}>
                  <Eye size={16} />
                </Button>
                <Button variant="outline" onClick={() => deleteAgent(agent._id!)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedAgentId && (
        <AgentDetailsDialog
          agentId={selectedAgentId}
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
        />
      )}
    </>
  );
}