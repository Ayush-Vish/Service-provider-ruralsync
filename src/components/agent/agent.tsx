import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentForm from "./agent-form";
import AgentTable from "./agent-table";


type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
};

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-9876",
      specialization: "Electrician",
    },
  ]);

  const addAgent = (agent: Agent) => {
    setAgents((prev) => [...prev, agent]);
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <AgentForm addAgent={addAgent} />
        </div>
        <AgentTable agents={agents} deleteAgent={deleteAgent} />
      </CardContent>
    </Card>
  );
}