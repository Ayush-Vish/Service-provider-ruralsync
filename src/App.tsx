import { useEffect } from "react";
import DashboardLayout from "./layout/dashboard-layout";
import { useAuthStore } from "./stores/auth.store";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import CookieConsent from "./components/cookie-consent";
import { ThemeProvider } from "./dark-mode";
import { ModeToggle } from "./components/toggle";

function App() {
  const initialise = useAuthStore((state) => state.initialise);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const success = await initialise();
    if (!success) {
      navigate("/login");
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="w-full">
      <ThemeProvider>
        <CookieConsent />
        <Routes>
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
        <ModeToggle className="fixed bottom-4 right-4 p-2 bg-background border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-colors" />
      </ThemeProvider>
    </div>
  );
}

export default App;
