import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { Service } from "@/types/service"; // Adjust import path as necessary
import useLocation from "@/hooks/useLocation";

type ServiceFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (newService: Omit<Service, "id">) => void;
};

export default function ServiceForm({ isOpen, onClose, onAddService }: ServiceFormProps) {
  const { location, error } = useLocation();
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    basePrice: 0,
    estimatedDuration: "",
    category: "",
    availability: [],
    additionalTasks: [],
    location: { coordinates: [location?.latitude || 0, location?.longitude || 0] },
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    tags: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === "basePrice" ? parseFloat(value) : value,
    }));
  };

  // Handle availability changes
  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    setNewService((prev) => {
      const updatedAvailability = [...prev.availability];
      updatedAvailability[index] = { ...updatedAvailability[index], [field]: value };
      return { ...prev, availability: updatedAvailability };
    });
  };

  const handleAddAvailability = () => {
    setNewService((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: "", startTime: "", endTime: "" }],
    }));
  };

  // Handle additional tasks changes
  const handleExtraTaskChange = (index: number, field: string, value: string | number) => {
    setNewService((prev) => {
      const updatedTasks = [...prev.additionalTasks];
      updatedTasks[index] = { ...updatedTasks[index], [field]: value };
      return { ...prev, additionalTasks: updatedTasks };
    });
  };

  const handleAddExtraTask = () => {
    setNewService((prev) => ({
      ...prev,
      additionalTasks: [...prev.additionalTasks, { description: "", extraPrice: 0 }],
    }));
  };

  // Handle tags changes
  const handleTagChange = (index: number, value: string) => {
    setNewService((prev) => {
      const updatedTags = [...prev.tags];
      updatedTags[index] = value;
      return { ...prev, tags: updatedTags };
    });
  };

  const handleAddTag = () => {
    if (newService.tags.length < 5) {
      setNewService((prev) => ({
        ...prev,
        tags: [...prev.tags, ""],
      }));
    }
  };

  // Delete handlers
  const handleDeleteAvailability = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteExtraTask = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      additionalTasks: prev.additionalTasks.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteTag = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    onAddService(newService);
    // Resetting form state
    setNewService({
      name: "",
      description: "",
      basePrice: 0,
      estimatedDuration: "",
      category: "",
      availability: [],
      additionalTasks: [],
      location: { coordinates: [location?.latitude || 0, location?.longitude || 0] },
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
      tags: [],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Input id="name" name="name" placeholder="Service Name" value={newService.name} onChange={handleInputChange} required />
          <Textarea id="description" name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} required />
          <Input id="basePrice" name="basePrice" type="number" placeholder="Base Price" value={newService.basePrice} onChange={handleInputChange} required />
          
          {/* Availability */}
          <Button onClick={handleAddAvailability} className="w-full">Add Availability</Button>
          {newService.availability.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input placeholder="Day" value={item.day} onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)} />
              <Input placeholder="Start Time" value={item.startTime} onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)} />
              <Input placeholder="End Time" value={item.endTime} onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)} />
              <Button variant="outline" size="sm" onClick={() => handleDeleteAvailability(index)} className="mt-2"><Trash2 /></Button>
            </div>
          ))}
          
          {/* Extra Tasks */}
          <Button onClick={handleAddExtraTask} className="w-full">Add Extra Task</Button>
          {newService.additionalTasks.map((task, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input placeholder="Description" value={task.description} onChange={(e) => handleExtraTaskChange(index, "description", e.target.value)} />
              <Input placeholder="Extra Price" type="number" value={task.extraPrice} onChange={(e) => handleExtraTaskChange(index, "extraPrice", parseFloat(e.target.value) || 0)} />
              <Button variant="outline" size="sm" onClick={() => handleDeleteExtraTask(index)} className="mt-2"><Trash2 /></Button>
            </div>
          ))}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {newService.tags.map((tag, index) => (
              <div key={index} className="flex items-center">
                <Input placeholder="Tag" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} className="w-32" />
                <Button variant="outline" size="sm" onClick={() => handleDeleteTag(index)} className="ml-2"><Trash2 /></Button>
              </div>
            ))}
            <Button onClick={handleAddTag} disabled={newService.tags.length >= 5}>Add Tag</Button>
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
          <Button type="submit" className="w-full">Save Service</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
