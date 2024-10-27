
import { useState } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"

import SidebarMenuComponent from '@/components/sidebar-menu'
import OrganizationDetails from '@/components/org/orgDetails'
import Services from '@/components/service/services'
import Agents from '@/components/dashboard/agents'
import Bookings from '@/components/dashboard/booking'

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState('org-details')

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-gray-100">
        <SidebarMenuComponent onSectionChange={handleSectionChange} />

        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">{getSectionTitle(activeSection)}</h1>
          </header>

          {activeSection === 'org-details' && <OrganizationDetails />}
          {activeSection === 'services' && <Services />}
          {activeSection === 'agents' && <Agents />}
          {activeSection === 'bookings' && <Bookings />}
        </main>
      </div>
    </SidebarProvider>
  )
}

function getSectionTitle(section: string) {
  switch (section) {
    case 'org-details':
      return 'Organization Details'
    case 'services':
      return 'Services'
    case 'agents':
      return 'Agents'
    case 'bookings':
      return 'Bookings'
    default:
      return ''
  }
}
