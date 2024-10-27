

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'

export default function UnverifiedOrganization({ orgData, handleInputChange, handleSubmit }) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" name="orgName" value={orgData.orgName} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={orgData.phone} onChange={handleInputChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={orgData.address} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={orgData.description} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={orgData.website} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" name="logo" value={orgData.logo} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" name="latitude" value={orgData.latitude} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" name="longitude" value={orgData.longitude} onChange={handleInputChange} required />
            </div>
          </div>
          <div>
            <Label>Social Media</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input name="facebook" placeholder="Facebook" value={orgData.facebook} onChange={handleInputChange} />
              <Input name="twitter" placeholder="Twitter" value={orgData.twitter} onChange={handleInputChange} />
              <Input name="instagram" placeholder="Instagram" value={orgData.instagram} onChange={handleInputChange} />
            </div>
          </div>
          <Button type="submit">Submit for Verification</Button>
        </form>
      )
    }