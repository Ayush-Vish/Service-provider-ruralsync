import { useState } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"

import SidebarMenuComponent from '@/components/sidebar-menu'
import OrganizationDetails from '@/components/org/orgDetails'
import Services from '@/components/service/services'
import Agents from '@/components/agent/agent'
import Bookings from '@/components/booking/booking'
import AuditLogsPage from '@/components/auditlog/audit-log'

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState<string>('org-details')

  const handleSectionChange = (section : string) => {
    setActiveSection(section)
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background text-foreground">
        <SidebarMenuComponent onSectionChange={handleSectionChange} />

        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">
              {getSectionTitle(activeSection)}
            </h1>
          </header>

          {activeSection === 'org-details' && <OrganizationDetails />}
          {activeSection === 'services' && <Services />}
          {activeSection === 'agents' && <Agents />}
          {activeSection === 'bookings' && <Bookings />}
          {activeSection === 'audit-logs' && <AuditLogsPage />}
        </main>
      </div>
    </SidebarProvider>
  )
}

function getSectionTitle(section : string) {
  switch (section) {
    case 'org-details':
      return 'Organization Details'
    case 'services':
      return 'Services'
    case 'agents':
      return 'Agents'
    case 'bookings':
      return 'Bookings'
    case 'audit-logs':
      return 'Audit Logs'
    default:
      return ''
  }
}
