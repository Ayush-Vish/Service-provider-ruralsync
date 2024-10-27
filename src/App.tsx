import { useEffect } from "react";
import DashboardLayout from "./layout/dashboard-layout";
import { useAuthStore } from "./stores/auth.store";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/login";
import Register from "./pages/register";

function App() {
  const initialise = useAuthStore((state) => state.initialise);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const success = await initialise(); // Wait for the initialise function to complete
    if (!success) {
      navigate("/login");
    }
  };
  useEffect(() => {

    checkAuth();
  }, []); // Add dependencies to rerun effect

  return (
    <div className="w-full ">
      <Routes>
        <Route path="/" element={<DashboardLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
