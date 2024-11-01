import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizationData, useOrgStore } from "@/stores/org.store";
import RegistrationForm from "./register-org";

export default function OrganizationDetails() {
  const orgData = useOrgStore((state) => state.orgDetails);
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);

  useEffect(() => {
    getOrgDetails();
  }, [getOrgDetails]);

  return (
    <div className="p-6 bg-background text-foreground">
      <Card className="shadow-lg rounded-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            {orgData?.isVerified ? "Organization Information" : "Register Organization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgData?.isVerified ? (
            <OrganizationInfo orgData={orgData} />
          ) : (
            <RegistrationForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationInfo({ orgData }: { orgData: OrganizationData }) {
  return (
    <div className="space-y-8 text-muted-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem label="Organization Name" value={orgData.name} />
        <InfoItem label="Phone" value={orgData.phone} />
      </div>
      <InfoItem label="Description" value={orgData.description} />
      <InfoItem label="Address" value={orgData.address} />
      {orgData.website && <InfoItem label="Website" value={orgData.website} />}

      {orgData.logo && (
        <div>
          <Label className="font-bold">Logo</Label>
          <div className="mt-2">
            <img
              src={orgData.logo}
              alt="Organization Logo"
              width={200}
              height={200}
              className="rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
          </div>
        </div>
      )}

      {orgData.images && orgData.images.length > 0 && (
        <div>
          <Label className="font-bold">Images</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {orgData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg shadow-md transition-transform transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem label="Latitude" value={orgData.location?.coordinates?.[1]} />
        <InfoItem label="Longitude" value={orgData.location?.coordinates?.[0]} />
      </div>

      <SocialMediaSection socialMedia={orgData.socialMedia} />
      <BusinessHoursSection businessHours={orgData.businessHours} />
      <CategoriesSection categories={orgData.categories} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem label="Verification Status" value={orgData.isVerified ? "Verified" : "Not Verified"} />
        <InfoItem label="Rating" value={`${orgData.rating || 0} (${orgData.reviewCount || 0} reviews)`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoItem label="Services" value={orgData.serviceCount || 0} />
        <InfoItem label="Agents" value={orgData.agentCount || 0} />
        <InfoItem label="Clients" value={orgData.clients?.length || 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem label="Created At" value={new Date(orgData.createdAt).toLocaleString()} />
        <InfoItem label="Updated At" value={new Date(orgData.updatedAt).toLocaleString()} />
      </div>

      <Button
        className="w-full mt-6 bg-primary text-primary-foreground transition-colors hover:bg-red-500"
        disabled={!orgData.isVerified}
      >
        {orgData.isVerified ? "Edit Organization Details" : "Register Organization"}
      </Button>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <Label className="font-medium text-muted-foreground">{label}</Label>
      <p className={`mt-1 text-muted-foreground ${value ? '' : 'italic'}`}>{value || "N/A"}</p>
    </div>
  );
}

function SocialMediaSection({ socialMedia }: { socialMedia: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string } }) {
  return (
    <div>
      <Label className="font-bold text-muted-foreground">Social Media</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        {Object.entries(socialMedia || {}).map(([platform, link]) => (
          <InfoItem key={platform} label={platform} value={link} />
        ))}
      </div>
    </div>
  );
}

function BusinessHoursSection({ businessHours }: { businessHours?: Record<string, { start: string; end: string } | "Closed"> }) {
  return (
    <div>
      <Label className="font-bold text-muted-foreground">Business Hours</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        {Object.entries(businessHours || {}).map(([day, hours]) => (
          <InfoItem
            key={day}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            value={hours === "Closed" ? "Closed" : `${hours.start} - ${hours.end}`}
          />
        ))}
      </div>
    </div>
  );
}

function CategoriesSection({ categories }: { categories?: string[] }) {
  return (
    <div>
      <Label className="font-bold text-muted-foreground">Service Categories</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground italic">No categories specified</p>
        )}
      </div>
    </div>
  );
}