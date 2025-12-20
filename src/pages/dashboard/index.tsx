import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from '@/stores/booking.store';
import { useAgentStore } from '@/stores/agent.store';
import { useServiceStore } from '@/stores/services.store';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Briefcase,
  UserCheck,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  loading 
}: { 
  title: string; 
  value: number | string; 
  description: string; 
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <Badge variant={trend.positive ? "default" : "destructive"} className="text-xs">
              {trend.positive ? '+' : ''}{trend.value}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const bookings = useBookingStore((state) => state.bookings);
  const isLoading = useBookingStore((state) => state.isLoading);
  const error = useBookingStore((state) => state.error);
  const getAllBookings = useBookingStore((state) => state.getAllBookings);
  
  const agents = useAgentStore((state) => state.agents);
  const getAllAgents = useAgentStore((state) => state.getAllAgents);
  
  const services = useServiceStore((state) => state.services);
  const getServices = useServiceStore((state) => state.getServices);

  useEffect(() => {
    getAllBookings();
    getAllAgents();
    getServices();
  }, []);

  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'PENDING').length || 0;
  const inProgressBookings = bookings?.filter(b => b.status === 'IN_PROGRESS').length || 0;
  const completedBookings = bookings?.filter(b => b.status === 'COMPLETED').length || 0;
  const completionRate = totalBookings > 0
    ? Math.round((completedBookings / totalBookings) * 100)
    : 0;

  const activeAgents = agents?.filter(a => a.status === 'FREE' || a.status === 'BUSY').length || 0;
  const totalServices = services?.length || 0;

  const recentBookings = bookings
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  if (error && (!bookings || bookings.length === 0)) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-xl">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
          <Button onClick={() => getAllBookings()} variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business performance.
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          description={`${pendingBookings} pending approval`}
          icon={Calendar}
          loading={isLoading}
        />
        <StatCard
          title="In Progress"
          value={inProgressBookings}
          description="Currently active bookings"
          icon={Clock}
          loading={isLoading}
        />
        <StatCard
          title="Completed"
          value={completedBookings}
          description={`${completionRate}% completion rate`}
          icon={CheckCircle2}
          loading={isLoading}
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          description={`Out of ${agents?.length || 0} total`}
          icon={Users}
          loading={isLoading}
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Available Services"
          value={totalServices}
          description="Service offerings available"
          icon={Briefcase}
          loading={isLoading}
        />
        <StatCard
          title="Performance Score"
          value={`${completionRate}%`}
          description="Overall completion rate"
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking requests from customers</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => navigate('/bookings')}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-30" />
                <p className="font-medium">No bookings yet</p>
                <p className="text-sm">Bookings will appear here once customers start booking.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate('/bookings')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {booking.client?.name || 'Unknown Customer'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.service?.name || 'Service'} • {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 gap-3"
              onClick={() => navigate('/bookings')}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              View All Bookings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 gap-3"
              onClick={() => navigate('/agents')}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              Manage Agents
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 gap-3"
              onClick={() => navigate('/services')}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              Manage Services
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 gap-3"
              onClick={() => navigate('/audit-logs')}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              View Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
