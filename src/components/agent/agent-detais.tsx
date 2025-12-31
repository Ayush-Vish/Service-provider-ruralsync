import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAgentStore, Agent } from "@/stores/agent.store";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  X
} from "lucide-react";

type AgentDetailsDialogProps = {
  agentId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function getStatusColor(status: string) {
  switch (status) {
    case 'FREE':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'BUSY':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'OFFLINE':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'FREE':
      return <CheckCircle className="w-3 h-3" />;
    case 'BUSY':
      return <Clock className="w-3 h-3" />;
    default:
      return null;
  }
}

export default function AgentDetailsDialog({ agentId, isOpen, setIsOpen }: AgentDetailsDialogProps) {
  const currAgent = useAgentStore((state) => state.currAgent);
  const getAgent = useAgentStore((state) => state.getAgent);

  useEffect(() => {
    if (isOpen && agentId) {
      getAgent(agentId);
    }
  }, [isOpen, agentId, getAgent]);

  const isLoading = !currAgent || currAgent._id !== agentId;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {currAgent.name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-xl">{currAgent.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(currAgent.status)}>
                      {getStatusIcon(currAgent.status)}
                      <span className="ml-1">{currAgent.status}</span>
                    </Badge>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h4>
              <div className="grid gap-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{currAgent.email}</p>
                  </div>
                </div>
                {currAgent.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{currAgent.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {currAgent.address && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{currAgent.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Services & Area */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Services & Coverage
              </h4>
              <div className="space-y-2">
                {currAgent.services && currAgent.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currAgent.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No services assigned</p>
                )}
                {currAgent.serviceArea && (
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Service Area: <strong>{currAgent.serviceArea}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Booking Stats */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Booking Statistics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {currAgent.currentBookings?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Current Bookings</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {currAgent.completedBookings?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {currAgent.feedback && currAgent.feedback.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Recent Feedback
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {currAgent.feedback.slice(0, 5).map((fb, index) => (
                      <div key={index} className="p-2 bg-muted/50 rounded-md text-sm italic">
                        "{fb}"
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
