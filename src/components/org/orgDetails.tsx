import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationData, useOrgStore } from "@/stores/org.store";
import RegistrationForm from "./regeister-org";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "../ui/tooltip";
import { useEffect } from "react";

export default function OrganizationDetails() {
  const orgData = useOrgStore((state) => state.orgDetails);
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);

  useEffect(() => {
    getOrgDetails();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {orgData?.isVerified
              ? "Organization Information"
              : "Register Organization"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgData?.isVerified ? (
            <OrganizationMetrics orgData={orgData} />
          ) : (
            <RegistrationForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationMetrics({
  orgData,
}: {
  orgData: OrganizationData;
}) {
  const metricsData = [
    { name: "Bookings", value: orgData?.bookingsCount || 0 },
    { name: "Revenue", value: orgData?.revenue || 0 },
    { name: "Agents", value: orgData?.agentCount || 0 },
    { name: "Services", value: orgData?.serviceCount || 0 },
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
    </div>
  );
}
