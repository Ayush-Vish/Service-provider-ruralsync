import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useOrgStore } from "@/stores/org.store";
import { useAuthStore } from "@/stores/auth.store";
import { Building2, Users, Briefcase, Calendar, LayoutDashboard, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SidebarMenuComponent({
  onSectionChange,
}: {
  onSectionChange: (section: string) => void;
}) {
  const orgDetails = useOrgStore((state) => state.orgDetails);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar className="">
      <SidebarHeader>
        <h2 className="text-xl font-bold px-4 py-2">
          {orgDetails ? orgDetails.name : "Service Provider Dashboard"}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("dashboard")}>
              <LayoutDashboard className="mr-2" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("org-details")}>
              <Building2 className="mr-2" />
              Organization Details
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("services")}>
              <Briefcase className="mr-2" />
              Services
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("agents")}>
              <Users className="mr-2" />
              Agents
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("bookings")}>
              <Calendar className="mr-2" />
              Bookings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange("audit-logs")}>
              <FileText className="mr-2" />
              Audit Logs
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="mr-2" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
