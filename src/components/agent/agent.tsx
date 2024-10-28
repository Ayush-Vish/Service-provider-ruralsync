"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgentStore } from "@/stores/agent.store";
import AgentForm from "./agent-form";
import AgentTable from "./agent-table";


export default function Agents() {
  const agents = useAgentStore((state) => state.agents);
  const getAllAgents = useAgentStore((state) => state.getAllAgents);
  const deleteAgent = useAgentStore((state) => state.deleteAgent);

  useEffect(() => {
    getAllAgents();
  }, [getAllAgents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <AgentForm  />
        </div>
        <AgentTable agents={agents} deleteAgent={deleteAgent} />
      </CardContent>
    </Card>
  );
}