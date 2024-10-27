import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrganizationDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue="QuickFix Solutions" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="555-1234" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Main St, Springfield" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue="Specialized in quick repairs and home service solutions." />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" defaultValue="https://quickfix.com" />
          </div>
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" defaultValue="https://quickfix.com/logo.png" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" defaultValue="40.73061" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" defaultValue="-73.935242" />
            </div>
          </div>
          <div>
            <Label>Social Media</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Facebook" defaultValue="https://facebook.com/quickfix" />
              <Input placeholder="Twitter" defaultValue="https://twitter.com/quickfix" />
              <Input placeholder="Instagram" defaultValue="https://instagram.com/quickfix" />
            </div>
          </div>
          <Button type="submit">Update Organization Details</Button>
        </form>
      </CardContent>
    </Card>
  )
}
