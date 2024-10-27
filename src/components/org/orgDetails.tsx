'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from '@/components/ui/tooltip'
import EditOrganizationForm from './edit-orgform'
import RegistrationForm from './regeister-org'


type OrganizationData = {
  orgName: string
  phone: string
  address: string
  description: string
  website: string
  logo: string
  facebook: string
  twitter: string
  instagram: string
  isVerified: boolean
}

const initialData: OrganizationData = {
  orgName: "",
  phone: "",
  address: "",
  description: "",
  website: "",
  logo: "",
  facebook: "",
  twitter: "",
  instagram: "",
  isVerified: false,
}

export default function OrganizationDetails() {
  const [orgData, setOrgData] = useState<OrganizationData>(initialData)
  const [isEditing, setIsEditing] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrgData(prev => ({ ...prev, [name]: value }))
  }

  const handleVerificationToggle = (checked: boolean) => {
    setOrgData(prev => ({ ...prev, isVerified: checked }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registering organization:', orgData)
    setOrgData(prev => ({ ...prev, isVerified: true }))
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updating organization:', orgData)
    setIsEditing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{orgData.isVerified ? "Organization Information" : "Register Organization"}</CardTitle>
      </CardHeader>
      <CardContent>
        {orgData.isVerified ? (
          isEditing ? (
            <EditOrganizationForm orgData={orgData} handleInputChange={handleInputChange} handleSubmit={handleUpdate} setIsEditing={setIsEditing} />
          ) : (
            <OrganizationMetrics orgData={orgData} setIsEditing={setIsEditing} onVerificationToggle={handleVerificationToggle} />
          )
        ) : (
          <RegistrationForm orgData={orgData} handleInputChange={handleInputChange} handleSubmit={handleRegister} />
        )}
      </CardContent>
    </Card>
  )
}

function OrganizationMetrics({ orgData, setIsEditing, onVerificationToggle }) {
  const metricsData = [
    { name: 'Bookings', value: 150212312 },
    { name: 'Revenue', value: 14324324000 },
    { name: 'Agents', value: 15 },
    { name: 'Services', value: 10 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organization Metrics</h3>
        <div className="flex items-center gap-4">
          <Switch checked={orgData.isVerified} onCheckedChange={onVerificationToggle} />
          <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
