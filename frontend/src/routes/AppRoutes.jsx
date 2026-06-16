import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RegionDetails from "../pages/RegionDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Region from "../pages/Region";
import News from "../pages/News";
import Conflicts from "../pages/Conflicts";
import Chat from "../pages/Chat";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/regions"
          element={
            <AppLayout>
              <Region />
            </AppLayout>
          }
        />
        <Route
  path="/regions/:id"
  element={
    <AppLayout>
      <RegionDetails />
    </AppLayout>
  }
/>
<Route
  path="/news"
  element={
    <AppLayout>
      <News />
    </AppLayout>
  }
/>

<Route
  path="/conflicts"
  element={
    <AppLayout>
      <Conflicts />
    </AppLayout>
  }
/>
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <AppLayout>
        <Chat />
      </AppLayout>
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}