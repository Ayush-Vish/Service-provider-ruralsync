import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarMenuComponent from '@/components/layout/sidebar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Toaster } from 'react-hot-toast';
import { 
  Bell, 
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrgStore } from '@/stores/org.store';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const location = useLocation();
  const getOrgDetails = useOrgStore((state) => state.getOrgDetails);
  const orgDetails = useOrgStore((state) => state.orgDetails);

  useEffect(() => {
    getOrgDetails();
  }, [getOrgDetails]);

  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-background">
          {/* Sidebar */}
          <SidebarMenuComponent />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {/* Top Header Bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
              <div className="flex-1 flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block w-64 lg:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Theme Toggle */}
                <ModeToggle />

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-2 border-l ml-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{orgDetails?.name || 'Organization'}</p>
                    <p className="text-xs text-muted-foreground">Service Provider</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {orgDetails?.name?.charAt(0).toUpperCase() || 'O'}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="container py-6 px-6 lg:px-8 max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
