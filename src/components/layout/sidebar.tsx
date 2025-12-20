import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useOrgStore } from "@/stores/org.store";
import { useAuthStore } from "@/stores/auth.store";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Calendar, 
  LayoutDashboard, 
  FileText, 
  LogOut,
  Settings,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Bookings",
        icon: Calendar,
        path: "/bookings",
        badge: "New",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Services",
        icon: Briefcase,
        path: "/services",
      },
      {
        label: "Agents",
        icon: Users,
        path: "/agents",
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        label: "Details",
        icon: Building2,
        path: "/organization",
      },
      {
        label: "Audit Logs",
        icon: FileText,
        path: "/audit-logs",
      },
    ],
  },
];

export default function SidebarMenuComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const orgDetails = useOrgStore((state) => state.orgDetails);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">R</span>
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">RuralSync</h2>
            <p className="text-xs text-muted-foreground">Service Provider</p>
          </div>
        </Link>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="px-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full justify-start gap-3 h-10 px-3 rounded-lg transition-all",
                        isActive(item.path)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4",
                        isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] px-1.5 py-0",
                            isActive(item.path) && "bg-primary-foreground/20 text-primary-foreground"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive(item.path) && (
                        <ChevronRight className="h-4 w-4 text-primary-foreground" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        {/* Organization Info */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {orgDetails?.logo ? (
              <img 
                src={orgDetails.logo} 
                alt={orgDetails.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {orgDetails?.name || "Organization"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {orgDetails?.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-10 px-3 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
