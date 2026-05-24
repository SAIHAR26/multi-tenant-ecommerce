import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem("vshopToken");

    const user =
      localStorage.getItem("vshopUser");

    if (token && user) {

      setIsLoggedIn(true);

      console.log("User session restored");
    }

  }, []);

  return (
    <AppRoutes
      isLoggedIn={isLoggedIn}
    />
  );
}

export default App;