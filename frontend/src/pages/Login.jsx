import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = location.pathname.startsWith("/admin");
  const portalName = isAdmin ? "Admin Portal" : "Student Portal";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      if (isAdmin && user.role !== "admin") {
        logout();
        setError("Access denied. This is the Admin Portal.");
        return;
      }
      if (!isAdmin && user.role === "admin") {
        logout();
        setError("Access denied. Admins must log in via the Admin Portal.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <div className="auth-panel">
        <p className="eyebrow">{portalName}</p>
        <h1>Sign In</h1>
        <p className="muted">Enter your credentials to access the library</p>

        {error && <div className="alert">{error}</div>}

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className={`primary-button ${isAdmin ? "admin-theme-btn" : ""}`} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link to={isAdmin ? "/admin/register" : "/student/register"}>Create one</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
