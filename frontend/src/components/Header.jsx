import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="topbar">
      <button className="icon-btn hamburger" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={19} />
        </button>

        <div className="user-menu" ref={dropdownRef}>
          <button className="user-menu-trigger" onClick={() => setDropdownOpen((o) => !o)}>
            <div className="avatar">{initial}</div>
            <div className="user-menu-info">
              <div className="user-menu-name">{user?.name}</div>
              <div className="user-menu-role">{user?.role}</div>
            </div>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-name">{user?.name}</div>
                <div className="user-dropdown-email">{user?.email}</div>
              </div>
              <button className="user-dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
