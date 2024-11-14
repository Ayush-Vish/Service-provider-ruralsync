import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Booking, useBookingStore } from '@/stores/booking.store';

type BookingDetailsModalProps = {
  bookingId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function BookingDetailsModal({ bookingId, isOpen, setIsOpen }: BookingDetailsModalProps) {
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const getBookingDetails = useBookingStore((state) => state.getBookingDetails);

  useEffect(() => {
    if (isOpen && bookingId) {
      getBookingDetails(bookingId).then(details => setBookingDetails(details));
    }
  }, [isOpen, bookingId, getBookingDetails]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        {bookingDetails ? (
          <div className="space-y-4">
            <p><strong>Customer Name:</strong> {bookingDetails?.client?.name}</p>
            <p><strong>Service:</strong> {bookingDetails.service.name} - {bookingDetails.service.description}</p>
            <p><strong>Date & Time:</strong> {bookingDetails.bookingDate} {bookingDetails.bookingTime}</p>
            <p><strong>Status:</strong> {bookingDetails.status}</p>
            <p><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</p>
            <p><strong>Location:</strong> {bookingDetails.location.coordinates.join(', ')}</p>
            <p><strong>Extra Tasks:</strong> {bookingDetails.extraTasks.map(task => task.description).join(', ') || 'None'}</p>
            <p><strong>Created At:</strong> {bookingDetails.createdAt}</p>
            <p><strong>Updated At:</strong> {bookingDetails.updatedAt}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}