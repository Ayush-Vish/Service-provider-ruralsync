import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegistrationForm from "@/components/org/register-org";
import { OrganizationAPI, useOrgStore } from "@/stores/org.store";
import { 
  Building2, 
  Globe, 
  Phone, 
  MapPin, 
  Star, 
  Users, 
  Briefcase, 
  Calendar,
  Edit,
  ExternalLink,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function OrganizationPage() {
  const orgData = useOrgStore((state) => state.orgDetails);
  const isLoading = useOrgStore((state) => state.isLoading);
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);

  useEffect(() => {
    getOrgDetails();
  }, [getOrgDetails]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Manage your organization details
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Unable to load organization</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
              Failed to load organization details. Please try again.
            </p>
            <Button onClick={() => getOrgDetails()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orgData.isVerified) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register Organization</h1>
          <p className="text-muted-foreground">
            Complete your organization registration to get started
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Organization Registration</CardTitle>
            <CardDescription>
              Fill in the details below to register your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="text-muted-foreground">
            Manage your organization details and settings
          </p>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {orgData.logo ? (
                <img 
                  src={orgData.logo} 
                  alt={orgData.name} 
                  className="w-24 h-24 rounded-xl object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center border">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{orgData.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {orgData.isVerified && (
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Verified
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{orgData.rating}</span>
                      <span className="text-muted-foreground text-sm">({orgData.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{orgData.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orgData.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{orgData.phone}</span>
                  </div>
                )}
                {orgData.website && (
                  <a 
                    href={orgData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {orgData.address && (
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{orgData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Services</p>
                <p className="text-2xl font-bold">{orgData.serviceCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agents</p>
                <p className="text-2xl font-bold">{orgData.agentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold">{orgData.clients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Hours & Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Hours */}
        {orgData.businessHours && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(orgData.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1.5 border-b last:border-0">
                    <span className="capitalize font-medium">{day}</span>
                    <span className="text-muted-foreground">
                      {hours === 'Closed' ? 'Closed' : `${hours.start} - ${hours.end}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        {orgData.categories && orgData.categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {orgData.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Images Gallery */}
      {orgData.images && orgData.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orgData.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${orgData.name} ${index + 1}`}
                  className="rounded-lg aspect-video object-cover hover:opacity-90 transition-opacity cursor-pointer"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(orgData.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date(orgData.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
