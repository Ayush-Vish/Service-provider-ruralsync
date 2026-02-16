import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Booking, useBookingStore } from '@/stores/booking.store';
import {
  Calendar, Clock, MapPin, User, Package, CreditCard,
  Shield, Wrench, Users, Loader2, AlertCircle
} from 'lucide-react';

type BookingDetailsModalProps = {
  bookingId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ASSIGNED: 'bg-indigo-100 text-indigo-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const ROLE_ICONS: Record<string, typeof Shield> = {
  PRIMARY: Shield,
  SUPPORT: Wrench,
  ASSISTANT: Users,
};

export default function BookingDetailsModal({ bookingId, isOpen, setIsOpen }: BookingDetailsModalProps) {
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getBookingDetails = useBookingStore((state) => state.getBookingDetails);

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true);
      setError(null);
      getBookingDetails(bookingId)
        .then(details => setBookingDetails(details))
        .catch(() => setError('Failed to load booking details'))
        .finally(() => setLoading(false));
    }
    if (!isOpen) {
      setBookingDetails(null);
      setError(null);
    }
  }, [isOpen, bookingId, getBookingDetails]);

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            {bookingDetails && (
              <Badge className={STATUS_COLORS[bookingDetails.status] || 'bg-gray-100 text-gray-800'}>
                {bookingDetails.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && bookingDetails && (
          <div className="space-y-5">
            {/* Client */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Client</h4>
              <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{bookingDetails.client?.name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{bookingDetails.client?.email || ''}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Service */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Service</h4>
              <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">{bookingDetails.service?.name || 'N/A'}</p>
                  {bookingDetails.service?.description && (
                    <p className="text-xs text-muted-foreground">{bookingDetails.service.description}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Schedule & Location */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Schedule & Location</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{bookingDetails.bookingDate ? formatDate(bookingDetails.bookingDate) : 'TBD'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{bookingDetails.bookingTime || 'TBD'}</p>
                  </div>
                </div>
              </div>
              {bookingDetails.location?.coordinates && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                  <MapPin className="h-4 w-4" />
                  <span>{bookingDetails.address || `${bookingDetails.location.coordinates[1]?.toFixed(4)}, ${bookingDetails.location.coordinates[0]?.toFixed(4)}`}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Assigned Agents */}
            {bookingDetails.assignedAgents && bookingDetails.assignedAgents.length > 0 && (
              <>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Assigned Agents ({bookingDetails.assignedAgents.length})
                  </h4>
                  <div className="space-y-2">
                    {bookingDetails.assignedAgents.map((a) => {
                      const RoleIcon = ROLE_ICONS[a.role] || Shield;
                      return (
                        <div key={a.agent._id} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {a.agent.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{a.agent.name}</p>
                              <p className="text-xs text-muted-foreground">{a.agent.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <RoleIcon className="h-2.5 w-2.5" />
                            {a.role}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Payment & Extras */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Payment</h4>
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                <CreditCard className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{bookingDetails.paymentStatus || 'Unpaid'}</span>
              </div>
            </div>

            {bookingDetails.extraTasks && bookingDetails.extraTasks.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Extra Tasks</h4>
                  <div className="space-y-1">
                    {bookingDetails.extraTasks.map((task, i) => (
                      <div key={i} className="flex justify-between text-sm bg-muted/30 rounded-lg p-3">
                        <span>{task.description}</span>
                        <span className="font-medium text-green-600">${task.extraPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground pt-2 flex justify-between">
              <span>Created: {formatDate(bookingDetails.createdAt)}</span>
              <span>Updated: {formatDate(bookingDetails.updatedAt)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
