import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Agent, useAgentStore } from "@/stores/agent.store";
import useLocation from "@/hooks/useLocation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin } from "lucide-react";

const serviceOptions = [
  { label: "Cooler Repair", value: "coolerRepair" },
  { label: "Washing Machine Repair", value: "washingMachineRepair" },
  { label: "AC Repair", value: "acRepair" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
];

export default function AgentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const registerAgent = useAgentStore((state) => state.registerAgent);
  const { location, error: locationError } = useLocation();

  const [agent, setAgent] = useState<Agent>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    location: { latitude: 0, longitude: 0 },
    services: [],
    serviceArea: "",
  });

  // Update location when hook provides it
  React.useEffect(() => {
    if (location) {
      setAgent((prev) => ({
        ...prev,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));
    }
  }, [location]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setAgent((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((s) => s !== value)
        : [...prev.services, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agent.name && agent.email && agent.phoneNumber) {
      try {
        await registerAgent({
          name: agent.name,
          email: agent.email,
          phoneNumber: agent.phoneNumber,
          password: agent.password,
          address: agent.address,
          services: agent.services,
          serviceArea: agent.serviceArea,
          location: {
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
          },
        });

        setAgent({
          name: "",
          email: "",
          phoneNumber: "",
          password: "",
          address: "",
          location: { latitude: 0, longitude: 0 },
          services: [],
          serviceArea: "",
        });

        setIsOpen(false);
      } catch (error) {
        console.error("Failed to register agent:", error);
      }
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Full Name"
              value={agent.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={agent.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phoneNumber"
              placeholder="Phone Number"
              value={agent.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={agent.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Address"
              value={agent.address}
              onChange={handleInputChange}
            />
          </div>

          {locationError ? (
            <Alert variant="destructive">
              <MapPin className="h-4 w-4" />
              <AlertDescription>{locationError.message}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={agent.location.latitude}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={agent.location.longitude}
                  disabled
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Services</Label>
            <div className="grid grid-cols-2 gap-2">
              {serviceOptions.map((service) => (
                <Button
                  key={service.value}
                  type="button"
                  variant={
                    agent.services.includes(service.value)
                      ? "default"
                      : "outline"
                  }
                  className="w-full"
                  onClick={() => handleServiceChange(service.value)}
                >
                  {service.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              name="serviceArea"
              placeholder="Service Area"
              value={agent.serviceArea}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Agent
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}