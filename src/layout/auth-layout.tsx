import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ModeToggle } from '@/components/theme/mode-toggle';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 via-primary to-primary/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">RuralSync</h1>
              <p className="text-primary-foreground/80 mt-1">Service Provider Portal</p>
            </div>
            
            <div className="space-y-6">
              <blockquote className="text-xl font-medium leading-relaxed">
                "Empowering rural communities with seamless service management and delivery."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Trusted by 500+ Service Providers</p>
                  <p className="text-sm text-primary-foreground/70">Across rural India</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-primary-foreground/70">Bookings</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">5K+</p>
                <p className="text-xs text-primary-foreground/70">Agents</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-primary-foreground/70">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6">
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-primary">RuralSync</h1>
            </div>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>

          <footer className="p-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} RuralSync. All rights reserved.
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
