import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, PlusCircle } from "lucide-react";
import ImageUpload from "../uploadImage";
import {  ServiceFormData } from "@/stores/services.store";


type ServiceFormProps = {
  newService: ServiceFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddService: (e: React.FormEvent) => void;
  handleAddAvailability: () => void;
  handleAvailabilityChange: (index: number, field: string, value: string) => void;
  handleDeleteAvailability: (index: number) => void;
  handleAddExtraTask: () => void;
  handleExtraTaskChange: (index: number, field: string, value: string | number) => void;
  handleDeleteExtraTask: (index: number) => void;
  handleAddTag: () => void;
  handleTagChange: (index: number, value: string) => void;
  handleDeleteTag: (index: number) => void;
  isAddingService: boolean;
  setIsAddingService: (isAdding: boolean) => void;
  error: { message: string } | null;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
};

export default function ServiceForm({
  newService,
  handleInputChange,
  handleAddService,
  handleAddAvailability,
  handleAvailabilityChange,
  handleDeleteAvailability,
  handleAddExtraTask,
  handleExtraTaskChange,
  handleDeleteExtraTask,
  handleAddTag,
  handleTagChange,
  handleDeleteTag,
  isAddingService,
  setIsAddingService,
  error,
  imageFiles, 
  setImageFiles

}: ServiceFormProps) {


  return (
    <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          <PlusCircle className="mr-2" />
          Add New Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddService} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="name"
              name="name"
              placeholder="Service Name"
              value={newService.name}
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
          </div>
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            value={newService.description}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="category"
              name="category"
              placeholder="Category"
              value={newService.category}
              onChange={handleInputChange}
              required
            />
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              placeholder="Estimated Duration"
              value={newService.estimatedDuration}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Availability */}
          <Button type="button" onClick={handleAddAvailability} className="w-full">
            Add Availability
          </Button>
          {newService.availability.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                  handleAvailabilityChange(index, "startTime", e.target.value)
                }
              />
              <Input
                placeholder="End Time"
                value={item.endTime}
                onChange={(e) =>
                  handleAvailabilityChange(index, "endTime", e.target.value)
                }
              />
              <Button
                type="button"
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
          <Button type="button" onClick={handleAddExtraTask} className="w-full">
            Add Extra Task
          </Button>
          {newService.additionalTasks.map((task, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Description"
                value={task.description}
                onChange={(e) =>
                  handleExtraTaskChange(index, "description", e.target.value)
                }
              />
              <Input
                placeholder="Extra Price"
                type="number"
                value={task.extraPrice}
                onChange={(e) =>
                  handleExtraTaskChange(index, "extraPrice", parseFloat(e.target.value))
                }
              />
              <Button
                type="button"
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
                  type="button"
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
              type="button"
              onClick={handleAddTag}
              disabled={newService.tags.length >= 5} // Disable if 5 tags already
            >
              Add Tag
            </Button>
          </div>
          <ImageUpload
            label="Upload Images"
            multiple={true}
            onChange={setImageFiles} // Set the uploaded files
            value={imageFiles} // Use the state to manage files
          />

          {error && <p className="text-red-500">{error.message}</p>}
          <Button type="submit" className="w-full">
            Save Service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}