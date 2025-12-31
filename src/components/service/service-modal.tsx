import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Service } from '@/stores/services.store';
import { 
  Clock, 
  DollarSign, 
  Tag, 
  Calendar, 
  MapPin, 
  Image as ImageIcon,
  ListChecks,
  X
} from 'lucide-react';

type ServiceDetailsDialogProps = {
  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
  selectedService: Service | null;
};

export default function ServiceDetailsDialog({
  isDetailsOpen,
  setIsDetailsOpen,
  selectedService,
}: ServiceDetailsDialogProps) {
  if (!selectedService) return null;

  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{selectedService.name}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mt-1">
              <Tag className="w-3 h-3 mr-1" />
              {selectedService.category || 'Uncategorized'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Images Gallery */}
        {selectedService.images && selectedService.images.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              Images
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {selectedService.images.map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={image} 
                    alt={`${selectedService.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">Description</h4>
          <p className="text-sm">{selectedService.description || 'No description provided.'}</p>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Base Price</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ₹{selectedService.basePrice?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {selectedService.estimatedDuration || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Availability Schedule
          </h4>
          {selectedService.availability && selectedService.availability.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {selectedService.availability.map((slot, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
                >
                  <span className="font-medium">{slot.day}</span>
                  <span className="text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No availability schedule set.</p>
          )}
        </div>

        {/* Additional Tasks */}
        {selectedService.additionalTasks && selectedService.additionalTasks.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                <ListChecks className="w-4 h-4" />
                Additional Tasks / Add-ons
              </h4>
              <div className="space-y-2">
                {selectedService.additionalTasks.map((task, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <span className="text-sm">{task.description}</span>
                    <Badge variant="outline" className="text-green-600">
                      +₹{task.extraPrice}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Location */}
        {selectedService.address && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Service Location
              </h4>
              <p className="text-sm">
                {[
                  selectedService.address.street,
                  selectedService.address.city,
                  selectedService.address.state,
                  selectedService.address.zipCode,
                  selectedService.address.country
                ].filter(Boolean).join(', ') || 'Location not specified'}
              </p>
            </div>
          </>
        )}

        {/* Tags */}
        {selectedService.tags && selectedService.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
