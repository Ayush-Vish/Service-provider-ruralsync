"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLocation from "@/hooks/useLocation";
import { Service, ServiceFormData, useServiceStore } from "@/stores/services.store";
import ServiceForm from "./service-form";
import ServiceTable from "./service-table";


export default function Services() {
  const services = useServiceStore((state) => state.services);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {  error } = useLocation();
  const [imageFiles, setImageFiles] = useState<File[]>([]); // New state for images

  const [newService, setNewService] = useState<ServiceFormData>({
    name: "",
    description: "",
    basePrice: 0,
    estimatedDuration: "",
    category: "",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    ],
    additionalTasks: [],
    location: { coordinates: [0, 0] },
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    tags: [],
    images:[]
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
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
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
    if (newService.tags.length < 5) {
      // Limit to 5 tags
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

  const deleteService = useServiceStore((state) => state.deleteService);
  const handleDeleteService = async (id: string) => {
    await deleteService(id);
  };

  const handleViewServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  const addService = useServiceStore((state) => state.addService);
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name" , newService.name);
    formdata.append("description" , newService.description);
    formdata.append("basePrice" , newService.basePrice.toString());
    formdata.append("estimatedDuration" , newService.estimatedDuration);
    formdata.append("category" , newService.category);
    formdata.append("availability" , JSON.stringify(newService.availability));
    formdata.append("additionalTasks" , JSON.stringify(newService.additionalTasks));
    formdata.append("location" , JSON.stringify(newService.location));
    formdata.append("address" , JSON.stringify(newService.address));
    formdata.append("tags" , JSON.stringify(newService.tags));
    imageFiles.forEach((file) => {
      formdata.append("images", file); // Key 'images' allows multiple files
    });

    await addService(formdata);
    // setNewService({
    //   name: "",
    //   description: "",
    //   basePrice: 0,
    //   estimatedDuration: "",
    //   category: "",
    //   availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    //   additionalTasks: [],
    //   location: {
    //     coordinates: [location?.latitude || 0, location?.longitude || 0],
    //   },
    //   address: { street: "", city: "", state: "", zipCode: "", country: "" },
    //   tags: [],
    //   images:[]
    // });
    setIsAddingService(false);
  };

  const getService = useServiceStore((state) => state.getServices);
  const handleGetServices = async () => {
    await getService();
  };

  useEffect(() => {
    handleGetServices();
  }, []);

  return (
    <Card className="mx-4 my-6 md:mx-8 lg:mx-16">
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <ServiceForm
            newService={newService}
            handleInputChange={handleInputChange}
            handleAddService={handleAddService}
            handleAddAvailability={handleAddAvailability}
            handleAvailabilityChange={handleAvailabilityChange}
            handleDeleteAvailability={handleDeleteAvailability}
            handleAddExtraTask={handleAddExtraTask}
            handleExtraTaskChange={handleExtraTaskChange}
            handleDeleteExtraTask={handleDeleteExtraTask}
            handleAddTag={handleAddTag}
            handleTagChange={handleTagChange}
            handleDeleteTag={handleDeleteTag}
            isAddingService={isAddingService}
            setIsAddingService={setIsAddingService}
            error={error}
            imageFiles={imageFiles} // Pass down image files
            setImageFiles={setImageFiles} //
          />
        </div>

        <ServiceTable
          services={services}
          handleViewServiceDetails={handleViewServiceDetails}
          handleDeleteService={handleDeleteService}
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedService={selectedService}
        />
      </CardContent>
    </Card>
  );
}