import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", studentId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = location.pathname.startsWith("/admin");
  const role = isAdmin ? "admin" : "student";
  const portalName = isAdmin ? "Admin Portal" : "Student Portal";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form.name, form.email, form.password, role, isAdmin ? undefined : form.studentId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <div className="auth-panel">
        <p className="eyebrow">{portalName}</p>
        <h1>Create Account</h1>
        <p className="muted">Register to access the library system</p>

        {error && <div className="alert">{error}</div>}

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
            />
          </label>
          {!isAdmin && (
            <label>
              Student ID
              <input
                type="text"
                placeholder="STU001"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
              />
            </label>
          )}
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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <button type="submit" className={`primary-button ${isAdmin ? "admin-theme-btn" : ""}`} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "20px", textAlign: "center" }}>
          Already have an account? <Link to={isAdmin ? "/admin/login" : "/student/login"}>Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
