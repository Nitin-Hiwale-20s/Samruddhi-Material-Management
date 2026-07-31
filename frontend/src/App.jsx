import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import ModulePage from "./pages/ModulePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lanes" element={<ModulePage moduleKey="lanes" />} />
        <Route path="/equipment" element={<ModulePage moduleKey="equipment" />} />
        <Route path="/inventory" element={<ModulePage moduleKey="inventory" />} />
        <Route path="/installations" element={<ModulePage moduleKey="installations" />} />
        <Route path="/cabletracking" element={<ModulePage moduleKey="cabletracking" />} />
        <Route path="/dailylogs" element={<ModulePage moduleKey="dailylogs" />} />
        <Route path="/workstatus" element={<ModulePage moduleKey="workstatus" />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
