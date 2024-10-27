import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
};

type AgentFormProps = {
  addAgent: (agent: Agent) => void;
};

export default function AgentForm({ addAgent }: AgentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState<Partial<Agent>>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agent.name && agent.email && agent.phone && agent.specialization) {
      addAgent({ ...agent, id: Math.random().toString(36).substr(2, 9) } as Agent);
      setAgent({ name: "", email: "", phone: "", specialization: "" });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Add New Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            placeholder="Agent Name"
            value={agent.name}
            onChange={handleInputChange}
            required
          />
          <Input
            id="email"
            name="email"
            placeholder="Email"
            value={agent.email}
            onChange={handleInputChange}
            required
          />
          <Input
            id="phone"
            name="phone"
            placeholder="Phone"
            value={agent.phone}
            onChange={handleInputChange}
            required
          />
          <Input
            id="specialization"
            name="specialization"
            placeholder="Specialization"
            value={agent.specialization}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" className="w-full">
            Save Agent
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}