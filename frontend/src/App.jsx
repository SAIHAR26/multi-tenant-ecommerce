import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {

      console.log(
        "User already logged in"
      );

    }

  }, []);

  return <AppRoutes />;
}

export default App;