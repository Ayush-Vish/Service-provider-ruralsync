"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegistrationForm from "./register-org";
import { OrganizationAPI, useOrgStore } from "@/stores/org.store";

/* =========================
   MAIN COMPONENT
========================= */

export default function OrganizationDetails() {
  const orgData = useOrgStore((state) => state.orgDetails);
  const isLoading = useOrgStore((state) => state.isLoading);
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);

  
  useEffect(() => {
    getOrgDetails();
  }, [getOrgDetails]);
  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }
  
  if (!orgData) {
    return <div className="p-6 text-muted-foreground">Failed to load organization details. Please try again.</div>;
  }

  return (
    <div className="p-6 bg-background text-foreground">
      <Card className="shadow-lg rounded-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {orgData.isVerified
              ? "Organization Information"
              : "Register Organization"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {orgData.isVerified ? (
            <OrganizationInfo orgData={orgData} />
          ) : (
            <RegistrationForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================
   ORGANIZATION INFO
========================= */

function OrganizationInfo({ orgData }: { orgData: OrganizationAPI }) {
  return (
    <div className="space-y-8 text-muted-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem label="Organization Name" value={orgData.name} />
        <InfoItem label="Phone" value={orgData.phone} />
      </div>

      <InfoItem label="Description" value={orgData.description} />
      <InfoItem label="Address" value={orgData.address} />
      <InfoItem label="Website" value={orgData.website} />

      {orgData.logo && (
        <ImageSection label="Logo">
          <img src={orgData.logo} alt="Logo" className="rounded-lg w-48" />
        </ImageSection>
      )}

      {orgData.images && orgData.images.length > 0 && (
        <ImageSection label="Images">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {orgData.images.map((img, i) => (
              <img key={i} src={img} className="rounded-lg" />
            ))}
          </div>
        </ImageSection>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem
          label="Latitude"
          value={orgData.location?.coordinates[1]}
        />
        <InfoItem
          label="Longitude"
          value={orgData.location?.coordinates[0]}
        />
      </div>

      <SocialMediaSection socialMedia={orgData.socialMedia} />
      <BusinessHoursSection businessHours={orgData.businessHours} />
      <CategoriesSection categories={orgData.categories} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem
          label="Verification Status"
          value={orgData.isVerified ? "Verified" : "Not Verified"}
        />
        <InfoItem
          label="Rating"
          value={`${orgData.rating} (${orgData.reviewCount} reviews)`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoItem label="Services" value={orgData.serviceCount} />
        <InfoItem label="Agents" value={orgData.agentCount} />
        <InfoItem label="Clients" value={orgData.clients} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem
          label="Created At"
          value={new Date(orgData.createdAt).toLocaleString()}
        />
        <InfoItem
          label="Updated At"
          value={new Date(orgData.updatedAt).toLocaleString()}
        />
      </div>

      <Button className="w-full mt-6">Edit Organization Details</Button>
    </div>
  );
}

/* =========================
   REUSABLE UI PARTS
========================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <Label className="font-medium">{label}</Label>
      <p className="mt-1 italic">{value ?? "N/A"}</p>
    </div>
  );
}

function ImageSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="font-bold">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function SocialMediaSection({
  socialMedia,
}: {
  socialMedia?: Record<string, string>;
}) {
  if (!socialMedia || Object.keys(socialMedia).length === 0) return null;

  return (
    <div>
      <Label className="font-bold">Social Media</Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {Object.entries(socialMedia).map(([k, v]) => (
          <InfoItem key={k} label={k} value={v} />
        ))}
      </div>
    </div>
  );
}

function BusinessHoursSection({
  businessHours,
}: {
  businessHours?: Record<string, { start: string; end: string } | "Closed">;
}) {
  if (!businessHours) return null;

  return (
    <div>
      <Label className="font-bold">Business Hours</Label>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {Object.entries(businessHours).map(([day, hours]) => (
          <InfoItem
            key={day}
            label={day}
            value={hours === "Closed" ? "Closed" : `${hours.start} - ${hours.end}`}
          />
        ))}
      </div>
    </div>
  );
}

function CategoriesSection({ categories }: { categories?: string[] }) {
  if (!categories || categories.length === 0) {
    return <p className="italic">No categories specified</p>;
  }

  return (
    <div>
      <Label className="font-bold">Service Categories</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
      </div>
    </div>
  );
}
