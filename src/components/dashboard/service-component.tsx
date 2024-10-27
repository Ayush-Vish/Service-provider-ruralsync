"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, PlusCircle, Trash2 } from "lucide-react";
import ServiceDetailsDialog from "../service/service-modal";
import useLocation from "@/hooks/useLocation";

type Service = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  category: string;
  availability: { day: string; startTime: string; endTime: string }[];
  additionalTasks: {
    description: string;
    extraPrice: number;
    timeAdded?: string;
  }[];
  location: { coordinates: [number, number] };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags: string[];
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsOpen , setIsDetailsOpen] = useState(false);
  const { location , error}  = useLocation();
  console.log(location)
  
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    basePrice: 0,
    estimatedDuration: "",
    category: "",
    availability: [],
    additionalTasks: [],
    location: { coordinates: [0, 0] },
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    tags: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === "basePrice" ? parseFloat(value) : value,
    }));
  };

  const handleAddAvailability = () => {
    setNewService((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { day: "", startTime: "", endTime: "" },
      ],
    }));
  };

  const handleAvailabilityChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedAvailability = newService.availability.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewService((prev) => ({ ...prev, availability: updatedAvailability }));
  };

  const handleDeleteAvailability = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleAddExtraTask = () => {
    setNewService((prev) => ({
      ...prev,
      additionalTasks: [
        ...prev.additionalTasks,
        { description: "", extraPrice: 0 },
      ],
    }));
  };

  const handleExtraTaskChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTasks = newService.additionalTasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    );
    setNewService((prev) => ({ ...prev, additionalTasks: updatedTasks }));
  };

  const handleDeleteExtraTask = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      additionalTasks: prev.additionalTasks.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (newService.tags.length < 5) { // Limit to 5 tags
      setNewService((prev) => ({
        ...prev,
        tags: [...prev.tags, ""],
      }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = newService.tags.map((tag, i) =>
      i === index ? value : tag
    );
    setNewService((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleDeleteTag = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };
  const handleViewServiceDetails = (service: Service) =>  {
    setSelectedService(service)
    setIsDetailsOpen(true)
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    setServices((prev) => [...prev, { ...newService, id }]);
    setNewService({
      name: "",
      description: "",
      basePrice: 0,
      estimatedDuration: "",
      category: "",
      availability: [],
      additionalTasks: [],
      location: { coordinates: [location?.latitude || 0 , location?.longitude||   0] },
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
      tags: [],
    });
    setIsAddingService(false);
  };

  return (
    <Card className="mx-4 my-6 md:mx-8 lg:mx-16">
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <PlusCircle className="mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddService} className="space-y-4">
                <Input
                  id="name"
                  name="name"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={newService.description}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  placeholder="Base Price"
                  value={newService.basePrice}
                  onChange={handleInputChange}
                  required
                />
                {/* Availability */}
                <Button onClick={handleAddAvailability} className="w-full">
                  Add Availability
                </Button>
                {newService.availability.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Day"
                      value={item.day}
                      onChange={(e) =>
                        handleAvailabilityChange(index, "day", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Start Time"
                      value={item.startTime}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "startTime",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="End Time"
                      value={item.endTime}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "endTime",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAvailability(index)}
                      className="mt-2"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}

                {/* Extra Tasks */}
                <Button onClick={handleAddExtraTask} className="w-full">
                  Add Extra Task
                </Button>
                {newService.additionalTasks.map((task, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Description"
                      value={task.description}
                      onChange={(e) =>
                        handleExtraTaskChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Extra Price"
                      type="number"
                      value={task.extraPrice}
                      onChange={(e) =>
                        handleExtraTaskChange(
                          index,
                          "extraPrice",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExtraTask(index)}
                      className="mt-2"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {newService.tags.map((tag, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        placeholder="Tag"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="w-32"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTag(index)}
                        className="ml-2"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={handleAddTag}
                    disabled={newService.tags.length >= 5} // Disable if 5 tags already
                  >
                    Add Tag
                  </Button>
                </div>
                  {error && <p>{error.message}</p>}
                <Button type="submit" className="w-full">
                  Save Service
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Table */}
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
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
