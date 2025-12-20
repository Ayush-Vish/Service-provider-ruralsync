import { RouterProvider } from "react-router-dom";
import router from "./routes";
import CookieConsent from "./components/cookie-consent";

function App() {
  return (
    <div className="w-full">
      <CookieConsent />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
