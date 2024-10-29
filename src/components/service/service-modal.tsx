import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
export type Service = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  category: string;
  availability: { day: string; startTime: string; endTime: string }[];
  additionalTasks: { description: string; extraPrice: number }[];
  tags: string[];
};

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
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>
        {selectedService && (
          <div className="space-y-4">
            <h3 className="font-semibold">Name:</h3>
            <p>{selectedService.name}</p>
            
            <h3 className="font-semibold">Description:</h3>
            <p>{selectedService.description}</p>
            
            <h3 className="font-semibold">Base Price:</h3>
            <p>${selectedService.basePrice}</p>
            
            <h3 className="font-semibold">Estimated Duration:</h3>
            <p>{selectedService.estimatedDuration}</p>
            
            <h3 className="font-semibold">Category:</h3>
            <p>{selectedService.category}</p>

            <h3 className="font-semibold">Availability:</h3>
            <ul>
              {selectedService.availability?.map((item, index) => (
                <li key={index}>
                  {item.day}: {item.startTime} - {item.endTime}
                </li>
              )) || <p>No availability provided.</p>}
            </ul>

            <h3 className="font-semibold">Additional Tasks:</h3>
            <ul>
              {selectedService.additionalTasks?.map((task, index) => (
                <li key={index}>
                  {task.description} - ${task.extraPrice}
                </li>
              )) || <p>No additional tasks.</p>}
            </ul>

            <h3 className="font-semibold">Tags:</h3>
            <p>{selectedService.tags?.join(", ") || "No tags provided."}</p>
          </div>
        )}
        <Button onClick={handleCloseDetails} className="mt-4">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
