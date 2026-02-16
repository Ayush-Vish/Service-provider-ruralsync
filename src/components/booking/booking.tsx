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
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings && filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <TableRow key={booking?._id}>
                  <TableCell className="font-mono text-xs">
                    {booking?._id?.slice(-8)}
                  </TableCell>
                  <TableCell>{booking?.client?.name || 'N/A'}</TableCell>
                  <TableCell>{booking?.service?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{booking?.bookingDate}</div>
                      <div className="text-xs text-muted-foreground">{booking?.bookingTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking?.assignedAgent ? (
                      <div className="space-y-1">
                        <div className="font-medium">{booking.assignedAgent.name}</div>
                        {booking.assignedAgent.phoneNumber && (
                          <div className="text-xs text-muted-foreground">{booking.assignedAgent.phoneNumber}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        booking?.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          booking?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {booking?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignAgent(booking?._id)}
                        disabled={!!booking?.assignedAgent}
                        title={booking?.assignedAgent ? 'Agent already assigned' : 'Assign agent'}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        {booking?.assignedAgent ? 'Reassign' : 'Assign'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking?._id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
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
