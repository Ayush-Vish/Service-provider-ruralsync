import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function OrgRegistration() {
  const [orgData, setOrgData] = useState({
    orgName: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    logo: '',
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.73061]
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    businessHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '16:00' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    isVerified: false,
    rating: 0,
    reviewCount: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrgData(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrgData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value }
    }))
  }

  const handleBusinessHoursChange = (day: string, type: 'start' | 'end', value: string) => {
    setOrgData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], [type]: value }
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement organization registration logic
    console.log('Organization registration data:', orgData)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Register Your Organization</CardTitle>
          <CardDescription>Provide details about your service provider organization</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  value={orgData.orgName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={orgData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={orgData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={orgData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={orgData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={orgData.logo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Social Media</Label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Facebook"
                  name="facebook"
                  value={orgData.socialMedia.facebook}
                  onChange={handleSocialMediaChange}
                />
                <Input
                  placeholder="Twitter"
                  name="twitter"
                  value={orgData.socialMedia.twitter}
                  onChange={handleSocialMediaChange}
                />
                <Input
                  placeholder="Instagram"
                  name="instagram"
                  value={orgData.socialMedia.instagram}
                  onChange={handleSocialMediaChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business Hours</Label>
              {Object.entries(orgData.businessHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-3 gap-2 items-center">
                  <span className="capitalize">{day}</span>
                  <Input
                    type="time"
                    value={hours.start}
                    onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                  />
                  <Input
                    type="time"
                    value={hours.end}
                    onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isVerified"
                checked={orgData.isVerified}
                onCheckedChange={(checked) => setOrgData(prev => ({ ...prev, isVerified: checked }))}
              />
              <Label htmlFor="isVerified">Verified Organization</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Register Organization</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}