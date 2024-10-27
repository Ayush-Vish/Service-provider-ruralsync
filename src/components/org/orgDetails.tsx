
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrgStore } from '@/stores/org.store';
import RegistrationForm from './regeister-org';
import EditOrganizationForm from './edit-orgform';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Tooltip } from '../ui/tooltip';

export default function OrganizationDetails() {
  const orgData = useOrgStore((state) => state.orgDetails);
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getOrgDetails();
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {orgData?.isVerified ? "Organization Information" : "Register Organization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgData?.isVerified ? (
            isEditing ? (
              <EditOrganizationForm orgData={orgData} onSubmit={handleUpdate} />
            ) : (
              <OrganizationMetrics orgData={orgData} setIsEditing={setIsEditing} />
            )
          ) : (
            <RegistrationForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationMetrics({ orgData, setIsEditing }) {
  
  const metricsData = [
    { name: 'Bookings', value: 150212312 },
    { name: 'Revenue', value: 14324324000 },
    { name: 'Agents', value: 15 },
    { name: 'Services', value: 10 },
  ];

  return (
    <div>
      <h2>Organization Metrics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
    </div>
  );
}