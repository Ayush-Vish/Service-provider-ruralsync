import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Booking, useBookingStore } from '@/stores/booking.store';
import AgentAssignmentModal from './assign-agent';
import BookingDetailsModal from './booking-detail';

export default function Bookings() {
  const bookings = useBookingStore(state => state.bookings);
  const getBookings = useBookingStore(state => state.getAllBookings);
  const assignBooking = useBookingStore(state => state.assignBooking);
  const [filter, setFilter] = useState<Booking['status'] | 'all'>('all');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredBookings = filter === 'all' ? bookings : bookings?.filter(booking => booking?.status === filter);

  const handleDeleteBooking = (id: string) => {
    // Add delete logic here
  };

  const handleAssignAgent = (id: string) => {
    setSelectedBookingId(id);
    setIsAgentModalOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedBookingId(id);
    setIsDetailsModalOpen(true);
  };

  const assignAgent = (bookingId: string, agentId: string) => {
    assignBooking({
      bookingId,
      agentId,
    });
  };

  async function handleGetBookings() {
    getBookings();
  }
  console.log(bookings)

  useEffect(() => {
    handleGetBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Select value={filter} onValueChange={(value: Booking['status'] | 'all') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings?.map(booking => (
              <TableRow key={booking?._id}>
                <TableCell>{booking?.client?.name}</TableCell>
                <TableCell>{booking?.service?.name}</TableCell>
                <TableCell>{booking?.bookingDate} {booking?.bookingTime}</TableCell>
                <TableCell>{booking?.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleAssignAgent(booking?._id)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Assign Agent
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewDetails(booking?._id)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteBooking(booking?._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {selectedBookingId && (
        <>
          <AgentAssignmentModal
            bookingId={selectedBookingId}
            isOpen={isAgentModalOpen}
            setIsOpen={setIsAgentModalOpen}
            assignAgent={assignAgent}
          />
          <BookingDetailsModal
            bookingId={selectedBookingId}
            isOpen={isDetailsModalOpen}
            setIsOpen={setIsDetailsModalOpen}
          />
        </>
      )}
    </Card>
  );
}
