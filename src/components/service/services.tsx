import { useState } from "react";
import { Service } from "@/types/service"; // Adjust the import path as necessary
import ServiceForm from "./service-form";
import ServiceTable from "./service-table";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddService = (newService: Omit<Service, "id">) => {
    setServices((prev) => [
      ...prev,
      { id: Date.now().toString(), ...newService }, // Example for generating an ID
    ]);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  const handleViewServiceDetails = (service: Service) => {
    // Logic for viewing service details can be implemented here
  };

  return (
    <div>
      <ServiceForm isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAddService={handleAddService} />
      <ServiceTable   services={services} onDeleteService={handleDeleteService} onViewServiceDetails={handleViewServiceDetails} />
    </div>
  );
}
