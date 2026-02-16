import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingStore } from '@/stores/booking.store';
import {
  ArrowLeft,
  Navigation,
  Phone,
  Clock,
  MapPin,
  RefreshCw,
  Wifi,
  WifiOff,
  Gauge,
  Compass,
  User,
  Shield,
  Wrench,
  Users as UsersIcon,
  Radio,
  Zap
} from 'lucide-react';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for agents
const createAgentIcon = (color: string, initial: string) => {
  return L.divIcon({
    className: 'custom-agent-marker',
    html: `
      <div style="
        width: 40px; height: 40px; border-radius: 50%;
        background: ${color}; border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 16px; color: white;
        position: relative;
      ">
        ${initial}
        <div style="
          position: absolute; bottom: -4px; right: -4px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #22c55e; border: 2px solid white;
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const destinationIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `
    <div style="
      width: 36px; height: 36px; border-radius: 50%;
      background: #ef4444; border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3" fill="white" stroke="#ef4444"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Component to auto-fit map bounds
function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p[0], p[1]]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [positions, map]);
  return null;
}

const agentColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#06b6d4'];

function getRoleIcon(role: string) {
  switch (role) {
    case 'PRIMARY': return Shield;
    case 'SUPPORT': return Wrench;
    case 'ASSISTANT': return UsersIcon;
    default: return User;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case 'PRIMARY': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'SUPPORT': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'ASSISTANT': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function LiveTrackingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { trackingData, isTrackingLoading, getBookingAgentsWithLocations } = useBookingStore();

  const [isLive, setIsLive] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchTracking = useCallback(() => {
    if (bookingId) {
      getBookingAgentsWithLocations(bookingId);
      setLastRefresh(new Date());
      setRefreshCount(c => c + 1);
    }
  }, [bookingId, getBookingAgentsWithLocations]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  // Auto-refresh every 5 seconds when live
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, [isLive, fetchTracking]);

  // Build map positions
  const mapPositions: [number, number][] = [];
  const booking = trackingData?.booking;
  const agents = trackingData?.agents || [];

  if (booking?.location?.coordinates) {
    const [lng, lat] = booking.location.coordinates;
    mapPositions.push([lat, lng]);
  }
  agents.forEach(a => {
    if (a.location?.coordinates) {
      const [lng, lat] = a.location.coordinates;
      mapPositions.push([lat, lng]);
    }
  });

  const activeAgents = agents.filter(a => a.location?.isActive);

  if (isTrackingLoading && !trackingData) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/bookings')}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Live Tracking</h1>
              {isLive && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Booking #{bookingId?.slice(-8)} &middot; {activeAgents.length} active agent{activeAgents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            {isLive ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchTracking} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{agents.length}</p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Radio className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeAgents.length}</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Broadcasting</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{refreshCount}</p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Updates</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/40 dark:to-violet-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-violet-700 dark:text-violet-300">
                {lastRefresh.toLocaleTimeString()}
              </p>
              <p className="text-xs text-violet-600/70 dark:text-violet-400/70">Last Update</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map + Agent List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 overflow-hidden border-0 shadow-md">
          <CardContent className="p-0">
            <div className="h-[500px] relative">
              {mapPositions.length > 0 ? (
                <MapContainer
                  center={mapPositions[0]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapBounds positions={mapPositions} />

                  {/* Booking destination marker */}
                  {booking?.location?.coordinates && (
                    <Marker
                      position={[
                        booking.location.coordinates[1],
                        booking.location.coordinates[0]
                      ]}
                      icon={destinationIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">Service Location</p>
                          <p className="text-sm text-gray-600">{booking.address || 'Destination'}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Agent markers */}
                  {agents.map((agent, idx) => {
                    if (!agent.location?.coordinates) return null;
                    const [lng, lat] = agent.location.coordinates;
                    const color = agentColors[idx % agentColors.length];
                    const initial = agent.name?.charAt(0).toUpperCase() || '?';

                    return (
                      <Marker
                        key={agent._id}
                        position={[lat, lng]}
                        icon={createAgentIcon(color, initial)}
                      >
                        <Popup>
                          <div className="min-w-[160px]">
                            <p className="font-semibold text-sm">{agent.name}</p>
                            <p className="text-xs text-gray-500">{agent.role} Agent</p>
                            {agent.location.speed && (
                              <p className="text-xs mt-1">Speed: {Math.round(agent.location.speed)} km/h</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Updated: {new Date(agent.location.lastUpdated).toLocaleTimeString()}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* Lines from agents to destination */}
                  {booking?.location?.coordinates && agents.map((agent, idx) => {
                    if (!agent.location?.coordinates) return null;
                    const destPos: [number, number] = [
                      booking.location.coordinates[1],
                      booking.location.coordinates[0]
                    ];
                    const agentPos: [number, number] = [
                      agent.location.coordinates[1],
                      agent.location.coordinates[0]
                    ];
                    return (
                      <Polyline
                        key={`line-${agent._id}`}
                        positions={[agentPos, destPos]}
                        pathOptions={{
                          color: agentColors[idx % agentColors.length],
                          dashArray: '8, 8',
                          weight: 2,
                          opacity: 0.6
                        }}
                      />
                    );
                  })}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/20">
                  <div className="text-center space-y-3">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-muted-foreground">No Location Data</p>
                      <p className="text-sm text-muted-foreground/70">
                        Waiting for agents to share their location...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Live indicator overlay */}
              {isLive && (
                <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent List */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              Assigned Agents
            </CardTitle>
            <CardDescription>
              {agents.length} agent{agents.length !== 1 ? 's' : ''} on this booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No agents assigned yet</p>
              </div>
            ) : (
              agents.map((agent, idx) => {
                const RoleIcon = getRoleIcon(agent.role);
                const hasLocation = !!agent.location?.isActive;

                return (
                  <div
                    key={agent._id}
                    className="p-3.5 rounded-xl border bg-card hover:shadow-sm transition-all space-y-3"
                  >
                    {/* Agent Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: agentColors[idx % agentColors.length] }}
                        >
                          {agent.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge className={`text-[10px] px-1.5 py-0 ${getRoleColor(agent.role)}`}>
                              <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                              {agent.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasLocation ? (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800">
                            <Wifi className="h-2.5 w-2.5 mr-0.5" />
                            Live
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-gray-500">
                            <WifiOff className="h-2.5 w-2.5 mr-0.5" />
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Location Details */}
                    {agent.location && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {agent.location.speed !== undefined && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Gauge className="h-3 w-3" />
                            <span>{Math.round(agent.location.speed)} km/h</span>
                          </div>
                        )}
                        {agent.location.heading !== undefined && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Compass className="h-3 w-3" />
                            <span>{Math.round(agent.location.heading)}°</span>
                          </div>
                        )}
                        {agent.location.lastUpdated && (
                          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(agent.location.lastUpdated).toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact */}
                    {agent.phoneNumber && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs gap-1.5"
                        onClick={() => window.open(`tel:${agent.phoneNumber}`)}
                      >
                        <Phone className="h-3 w-3" />
                        Call Agent
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Info */}
      {booking && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{booking.address || 'No address'}</span>
              </div>
              <Badge>{booking.status}</Badge>
              {booking.service && (
                <span className="text-muted-foreground">
                  Service: <span className="font-medium text-foreground">{(booking.service as any).name}</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
