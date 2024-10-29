"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import useLocation from "../../hooks/useLocation";
import { useOrgStore } from "@/stores/org.store";
import toast from "react-hot-toast";
import ImageUpload from "../uploadImage";

// Validation functions
const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

const validateUrl = (url: string) => {
  if (!url) return true; // Optional fields
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateFileSize = (file: File, maxSize: number = 5) => {
  const fileSize = file.size / 1024 / 1024; // Convert to MB
  return fileSize <= maxSize;
};

export type OrganizationData = {
  name: string;
  phone: string;
  address: string;
  description: string;
  website: string;
  logo: File | null;
  images: File[];
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin?: string;
  };
  businessHours: Record<string, { start: string; end: string }>;
  location?: {
    coordinates: [number, number];
  };
  isVerified?: boolean;
  bookingsCount?: number;
  revenue?: number;
  agentCount?: number;
  serviceCount?: number;
  clients?: string[];
  reviewCount?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
};

const defaultBusinessHours: Record<string, { start: string; end: string }> = {
  Monday: { start: "09:00", end: "17:00" },
  Tuesday: { start: "09:00", end: "17:00" },
  Wednesday: { start: "09:00", end: "17:00" },
  Thursday: { start: "09:00", end: "17:00" },
  Friday: { start: "09:00", end: "17:00" },
  Saturday: { start: "09:00", end: "17:00" },
  Sunday: { start: "09:00", end: "17:00" },
};

export default function RegistrationForm() {
  const { location, error: locationError } = useLocation();
  const registerOrg = useOrgStore((state) => state.registerOrg);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [orgData, setOrgData] = useState<OrganizationData>({
    name: "",
    phone: "",
    address: "",
    description: "",
    website: "",
    logo: null,
    images: [],
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    businessHours: defaultBusinessHours,
    createdAt: "",
    updatedAt: "",
  });

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!orgData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    // if (!validatePhone(orgData.phone)) {
    //   newErrors.phone = "Please enter a valid phone number";
    // }

    if (!orgData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // if (orgData.website && !validateUrl(orgData.website)) {
    //   newErrors.website = "Please enter a valid website URL";
    // }

    // Validate social media URLs
    // Object.entries(orgData.socialMedia).forEach(([platform, url]) => {
    //   if (url && !validateUrl(url)) {
    //     newErrors[`socialMedia.${platform}`] = `Please enter a valid ${platform} URL`;
    //   }
    // });

    // Validate files
    if (orgData.logo && !validateFileSize(orgData.logo)) {
      newErrors.logo = "Logo file size should not exceed 5MB";
    }

    orgData.images.forEach((image, index) => {
      if (!validateFileSize(image)) {
        newErrors[`image${index}`] = `Image ${index + 1} size should not exceed 5MB`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [orgData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
    if (errors[`socialMedia.${name}`]) {
      setErrors((prev) => ({ ...prev, [`socialMedia.${name}`]: "" }));
    }
  };

  const handleBusinessHoursChange = (
    day: string,
    field: "start" | "end",
    value: string
  ) => {
    setOrgData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!location) {
      toast.error("Location is required. Please enable location services.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", orgData.name.trim());
      formData.append("phone", orgData.phone.trim());
      formData.append("address", orgData.address.trim());
      formData.append("description", orgData.description.trim());
      formData.append("website", orgData.website.trim());
      
      if (orgData.logo) {
        formData.append("logo", orgData.logo);
      }
      
      orgData.images.forEach((image, _) => {
        formData.append(`images`, image);
      });

      formData.append("socialMedia", JSON.stringify(orgData.socialMedia));
      formData.append("businessHours", JSON.stringify(orgData.businessHours));
      formData.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        })
      );

      const success = await registerOrg(formData);

      if (success) {
        toast.success("Organization registered successfully!");
        // Optional: Reset form or redirect
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Organization Name"
                name="name"
                value={orgData.name}
                onChange={handleInputChange}
                required
                error={errors.name}
              />
              <InputField
                label="Phone"
                name="phone"
                value={orgData.phone}
                onChange={handleInputChange}
                required
                error={errors.phone}
              />
            </div>
            <InputField
              label="Address"
              name="address"
              value={orgData.address}
              onChange={handleInputChange}
              required
              error={errors.address}
            />
            <TextareaField
              label="Description"
              name="description"
              value={orgData.description}
              onChange={handleInputChange}
              required
              error={errors.description}
            />
          </div>

          {/* Online Presence */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Online Presence</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Website"
                name="website"
                value={orgData.website}
                onChange={handleInputChange}
                error={errors.website}
              />
              <ImageUpload
                label="Logo"
                onChange={(files) =>
                  setOrgData((prev) => ({ ...prev, logo: files[0] || null }))
                }
                value={orgData.logo ? [orgData.logo] : []}
                // error={errors.logo}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <ImageUpload
              label="Images"
              multiple
              onChange={(files) =>
                setOrgData((prev) => ({ ...prev, images: files }))
              }
              value={orgData.images}
              // error={errors.images}
            />
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(orgData.socialMedia).map(([platform, value]) => (
                <InputField
                  key={platform}
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  name={platform}
                  value={value}
                  onChange={handleSocialMediaChange}
                  error={errors[`socialMedia.${platform}`]}
                />
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-2">
              {Object.entries(orgData.businessHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-4 gap-4 items-center">
                  <Label>{day}</Label>
                  <Input
                    type="time"
                    value={hours.start}
                    onChange={(e) =>
                      handleBusinessHoursChange(day, "start", e.target.value)
                    }
                  />
                  <Input
                    type="time"
                    value={hours.end}
                    onChange={(e) =>
                      handleBusinessHoursChange(day, "end", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Latitude"
                value={location?.latitude?.toString() || ""}
                readOnly
              />
              <InputField
                label="Longitude"
                value={location?.longitude?.toString() || ""}
                readOnly
              />
            </div>
            {locationError && (
              <Alert variant="destructive">
                <AlertDescription>{locationError.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register Organization'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type InputFieldProps = {
  label: string;
  name?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
};

function InputField({
  label,
  name,
  value,
  type = "text",
  onChange,
  required,
  readOnly,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
};

function TextareaField({
  label,
  name,
  value,
  onChange,
  required,
  error,
}: TextareaFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}