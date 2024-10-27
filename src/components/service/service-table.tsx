import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import ServiceDetailsDialog from "../service/service-modal";
import { Service } from "@/types/service"; // Adjust the import path as necessary
import { useState } from "react";

type ServiceTableProps = {
  services: Service[];
  onDeleteService: (id: string) => void;
};

export default function ServiceTable({ services, onDeleteService }: ServiceTableProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleViewServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Estimated Duration</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>{service.basePrice}</TableCell>
              <TableCell>{service.estimatedDuration}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleViewServiceDetails(service)} className="mr-2">
                  <Eye />
                </Button>
                <Button variant="outline" onClick={() => onDeleteService(service.id)}>
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Service Details Dialog */}
      {selectedService && (
        <ServiceDetailsDialog
          isDetailsOpen={isDetailsOpen}
            setIsDetailsOpen={setIsDetailsOpen}
          service={selectedService}
        />
      )}
    </>
  );
}
