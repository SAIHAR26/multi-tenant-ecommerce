import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useEffect(() => {
    const token =
      localStorage.getItem("vshopToken");
    const user =
      localStorage.getItem("vshopUser");
    if (token && user) {
      setIsLoggedIn(true);
      setUser(JSON.parse(user));
    }
  }, []);
  return <AppRoutes />;
}
export default App;