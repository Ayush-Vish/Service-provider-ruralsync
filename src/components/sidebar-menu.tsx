import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Building2, Users, Briefcase, Calendar } from 'lucide-react'

export default function SidebarMenuComponent({ onSectionChange  }
  :{
    onSectionChange: (section: string) => void;
  }
) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold px-4 py-2">Service Provider Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange('org-details')}>
              <Building2 className="mr-2" />
              Organization Details
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange('services')}>
              <Briefcase className="mr-2" />
              Services
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange('agents')}>
              <Users className="mr-2" />
              Agents
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange('bookings')}>
              <Calendar className="mr-2" />
              Bookings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onSectionChange('audit-logs')}>
              <Calendar className="mr-2" />
              Audit Logs
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
