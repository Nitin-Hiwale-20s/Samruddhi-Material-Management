import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Users, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import modulesConfig from "../config/modulesConfig";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...Object.entries(modulesConfig).map(([key, cfg]) => ({
      to: `/${key}`,
      label: cfg.title,
      icon: cfg.icon,
    })),
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/users", label: "Users", icon: Users, adminOnly: true },
  ];

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-badge">SP</div>
            <div className="brand-text">
              <div className="brand-title">Samruddhi Plaza</div>
              <div className="brand-subtitle">Material Management</div>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav>
          {menu.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
