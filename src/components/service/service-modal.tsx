import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

export default function ServiceDetailsDialog(  {
      isDetailsOpen,
      setIsDetailsOpen,
      selectedService,
}  ) {
      const handleCloseDetails = () => {
            setIsDetailsOpen(false);
      }
  return (
    <div>
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
                  {selectedService.availability.map((item, index) => (
                    <li key={index}>
                      {item.day}: {item.startTime} - {item.endTime}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold">Additional Tasks:</h3>
                <ul>
                  {selectedService.additionalTasks.map((task, index) => (
                    <li key={index}>
                      {task.description} - ${task.extraPrice}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold">Tags:</h3>
                <p>{selectedService.tags.join(", ")}</p>
                {/* Add more fields as necessary */}
              </div>
            )}
            <Button onClick={handleCloseDetails} className="mt-4">
              Close
            </Button>
          </DialogContent>
        </Dialog>
    </div>
  )
}
