import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import ServiceDetailsDialog from "../service/service-modal";
import { Service, useServiceStore } from "@/stores/services.store";



type ServiceTableProps = {
  services: Service[];
  handleViewServiceDetails: (service: Service) => void;
  handleDeleteService: (id: string) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (isOpen: boolean) => void;
  selectedService: Service | null;
};

export default function ServiceTable({
  handleViewServiceDetails,
  handleDeleteService,
  isDetailsOpen,
  setIsDetailsOpen,
  selectedService,
}: ServiceTableProps) {
      const services = useServiceStore((state) => state.services);
  return (
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
        {services.length > 0  && services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell>{service.basePrice}</TableCell>
            <TableCell>{service.estimatedDuration}</TableCell>
            <TableCell>{service.category}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => handleViewServiceDetails(service)}
                className="mr-2"
              >
                <Eye />
                <ServiceDetailsDialog
                  isDetailsOpen={isDetailsOpen}
                  setIsDetailsOpen={setIsDetailsOpen}
                  selectedService={selectedService}
                />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteService(service._id  as string)}
              >
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}