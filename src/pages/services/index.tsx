import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Service, ServiceFormData, useServiceStore } from "@/stores/services.store";
import ServiceForm from "@/components/service/service-form";
import ServiceDetailsDialog from "@/components/service/service-modal";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const services = useServiceStore((state) => state.services);
  const getServices = useServiceStore((state) => state.getServices);
  const addService = useServiceStore((state) => state.addService);
  const deleteService = useServiceStore((state) => state.deleteService);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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
    images: []
  });

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      await getServices();
      setIsLoading(false);
    };
    fetchServices();
  }, [getServices]);

  const filteredServices = services?.filter(service =>
    service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === "basePrice" ? parseFloat(value) || 0 : value,
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

  const handleAvailabilityChange = (index: number, field: string, value: string) => {
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
      additionalTasks: [...prev.additionalTasks, { description: "", extraPrice: 0 }],
    }));
  };

  const handleExtraTaskChange = (index: number, field: string, value: string | number) => {
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
      setNewService((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = newService.tags.map((tag, i) => (i === index ? value : tag));
    setNewService((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleDeleteTag = (index: number) => {
    setNewService((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", newService.name);
    formdata.append("description", newService.description);
    formdata.append("basePrice", newService.basePrice.toString());
    formdata.append("estimatedDuration", newService.estimatedDuration);
    formdata.append("category", newService.category);
    formdata.append("availability", JSON.stringify(newService.availability));
    formdata.append("additionalTasks", JSON.stringify(newService.additionalTasks));
    formdata.append("location", JSON.stringify(newService.location));
    formdata.append("address", JSON.stringify(newService.address));
    formdata.append("tags", JSON.stringify(newService.tags));
    imageFiles.forEach((file) => {
      formdata.append("images", file);
    });

    await addService(formdata);
    resetForm();
    setIsAddingService(false);
  };

  const resetForm = () => {
    setNewService({
      name: "",
      description: "",
      basePrice: 0,
      estimatedDuration: "",
      category: "",
      availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
      additionalTasks: [],
      location: { coordinates: [0, 0] },
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
      tags: [],
      images: []
    });
    setImageFiles([]);
  };

  const handleDeleteService = async () => {
    if (deleteConfirmId) {
      await deleteService(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleViewServiceDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings and pricing
          </p>
        </div>
        <Button onClick={() => setIsAddingService(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Service Form Dialog */}
      {isAddingService && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
            <CardDescription>Fill in the details for your new service</CardDescription>
          </CardHeader>
          <CardContent>
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
              error={null}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
            />
          </CardContent>
        </Card>
      )}

      {/* Services Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' 
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" 
          : "space-y-3"
        }>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No services found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {searchQuery 
                ? "Try adjusting your search query" 
                : "Get started by adding your first service"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddingService(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service._id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
              {service.images && service.images[0] && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={service.images[0]} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                    {service.category && (
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewServiceDetails(service)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setDeleteConfirmId(service._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {service.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <DollarSign className="h-4 w-4" />
                    ₹{service.basePrice}
                  </div>
                  {service.estimatedDuration && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {service.estimatedDuration}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Card key={service._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {service.images && service.images[0] && (
                    <img 
                      src={service.images[0]} 
                      alt={service.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{service.name}</h3>
                      {service.category && (
                        <Badge variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{service.basePrice}</p>
                      {service.estimatedDuration && (
                        <p className="text-xs text-muted-foreground">{service.estimatedDuration}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewServiceDetails(service)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteConfirmId(service._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsDialog
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedService={selectedService}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
