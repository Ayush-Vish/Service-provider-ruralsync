import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
};

type AgentTableProps = {
  agents: Agent[];
  deleteAgent: (id: string) => void;
};

export default function AgentTable({ agents, deleteAgent }: AgentTableProps) {
  return (
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
          <TableRow key={agent.id}>
            <TableCell>{agent.name}</TableCell>
            <TableCell>{agent.email}</TableCell>
            <TableCell>{agent.phone}</TableCell>
            <TableCell>{agent.specialization}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="mr-2">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteAgent(agent.id)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}