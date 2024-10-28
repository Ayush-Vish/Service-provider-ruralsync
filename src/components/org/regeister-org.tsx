'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useLocation from "../../hooks/useLocation"
import { useOrgStore } from "@/stores/org.store"
import toast from 'react-hot-toast'

export type BusinessHours = {
  day: string
  open: string
  close: string
  isOpen: boolean
}

type OrganizationData = {
  orgName: string
  phone: string
  address: string
  description: string
  website: string
  logo: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
  businessHours: BusinessHours[]
  isVerified?: boolean
}

const defaultBusinessHours: BusinessHours[] = [
  { day: 'Monday', open: '09:00', close: '17:00', isOpen: true },
  { day: 'Tuesday', open: '09:00', close: '17:00', isOpen: true },
  { day: 'Wednesday', open: '09:00', close: '17:00', isOpen: true },
  { day: 'Thursday', open: '09:00', close: '17:00', isOpen: true },
  { day: 'Friday', open: '09:00', close: '17:00', isOpen: true },
  { day: 'Saturday', open: '09:00', close: '17:00', isOpen: false },
  { day: 'Sunday', open: '09:00', close: '17:00', isOpen: false }
]

export default function RegistrationForm() {
  const { location, error: locationError } = useLocation()
  const registerOrg = useOrgStore((state) => state.registerOrg)

  const [orgData, setOrgData] = useState<OrganizationData>({
    orgName: "",
    phone: "",
    address: "",
    description: "",
    website: "",
    logo: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    businessHours: defaultBusinessHours
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrgData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrgData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value }
    }))
  }

  const handleBusinessHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    setOrgData((prev) => {
      const newBusinessHours = [...prev.businessHours]
      newBusinessHours[index] = {
        ...newBusinessHours[index],
        [field]: value
      }
      return { ...prev, businessHours: newBusinessHours }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!location) {
      toast.error("Location is required. Please enable location services.")
      return
    }

    const organizationData = {
      ...orgData,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude]
      }
    }

    const success = await registerOrg(organizationData)
    
    if (success) {
      toast.success("Organization registered successfully!")
    } else {
      toast.error("Registration failed. Please try again.")
    }
  }

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
                name="orgName" 
                value={orgData.orgName} 
                onChange={handleInputChange}
                required 
              />
              <InputField 
                label="Phone" 
                name="phone" 
                value={orgData.phone} 
                onChange={handleInputChange}
                required 
              />
            </div>
            <InputField 
              label="Address" 
              name="address" 
              value={orgData.address} 
              onChange={handleInputChange}
              required 
            />
            <TextareaField 
              label="Description" 
              name="description" 
              value={orgData.description} 
              onChange={handleInputChange}
              required 
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
              />
              <InputField 
                label="Logo URL" 
                name="logo" 
                value={orgData.logo} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField 
                label="Facebook" 
                name="facebook" 
                value={orgData.socialMedia.facebook} 
                onChange={handleSocialMediaChange} 
              />
              <InputField 
                label="Twitter" 
                name="twitter" 
                value={orgData.socialMedia.twitter} 
                onChange={handleSocialMediaChange} 
              />
              <InputField 
                label="Instagram" 
                name="instagram" 
                value={orgData.socialMedia.instagram} 
                onChange={handleSocialMediaChange} 
              />
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <div className="space-y-2">
              {orgData.businessHours.map((hours, index) => (
                <div key={hours.day} className="grid grid-cols-4 gap-4 items-center">
                  <Label>{hours.day}</Label>
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                    disabled={!hours.isOpen}
                  />
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                    disabled={!hours.isOpen}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => handleBusinessHoursChange(index, 'isOpen', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label>Open</Label>
                  </div>
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
                value={location?.latitude?.toString() || ''} 
                readOnly 
              />
              <InputField 
                label="Longitude" 
                value={location?.longitude?.toString() || ''} 
                readOnly 
              />
            </div>
            {locationError && (
              <p className="text-red-500">{locationError.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">Register Organization</Button>
        </form>
      </CardContent>
    </Card>
  )
}

type InputFieldProps = {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
};

function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  )
}

type TextareaFieldProps = {
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
};

function TextareaField({ label, ...props }: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea {...props} />
    </div>
  )
}