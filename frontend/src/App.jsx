import AppRoutes from "./routes/AppRoutes";
const token =
  localStorage.getItem("token");
function App() {
  return <AppRoutes />;
}

export default App;