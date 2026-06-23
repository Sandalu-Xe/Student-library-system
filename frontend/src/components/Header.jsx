import { BookOpen, ClipboardList, LayoutDashboard, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Student Library</p>
        <Link to="/" className="logo-link">
          <h1>Library Management</h1>
        </Link>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end title="Home">
          Home
        </NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" title="Dashboard">
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/books" title="Books">
              <BookOpen size={18} />
              Books
            </NavLink>
            <NavLink to="/borrowings" title="Borrowings">
              <ClipboardList size={18} />
              Borrowings
            </NavLink>
          </>
        )}
      </nav>

      {user ? (
        <div className="profile-chip">
          <span>{user.name}</span>
          <small>{user.role}</small>
          <button
            className="icon-button"
            onClick={handleLogout}
            title="Sign out"
            style={{ gridRow: "span 2" }}
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <div className="auth-header-actions">
          <Link to="/login" className="secondary-button auth-btn">
            <LogIn size={16} />
            Sign In
          </Link>
          <Link to="/register" className="primary-button auth-btn">
            <UserPlus size={16} />
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
