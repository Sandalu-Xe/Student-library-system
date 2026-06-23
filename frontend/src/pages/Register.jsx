import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SocialAuthModal from "../components/SocialAuthModal.jsx";

const Register = () => {
  const { register, socialLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [socialProvider, setSocialProvider] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    }
  };

  const handleSocialAuth = async (payload) => {
    await socialLogin(payload);
    navigate("/dashboard");
  };

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <p className="eyebrow">Student Library</p>
        <h1>Create account</h1>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              minLength={6}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button type="submit" className="primary-button">
            Create account
          </button>
        </form>

        <div className="auth-divider">
          <span>or connect with</span>
        </div>

        <div className="social-buttons-stack">
          <button
            type="button"
            className="social-btn social-btn-google"
            onClick={() => setSocialProvider("google")}
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.2662 9.7651A7.0774 7.0774 0 0 1 12 4.9091c1.6909 0 3.218.6 4.4182 1.5818l3.51-3.51C17.7818 1.109 15.0545 0 12 0 7.3527 0 3.371 2.6727 1.3964 6.5782l3.8698 3.1869z"
              />
              <path
                fill="#34A853"
                d="M16.04 15.34C15.01 16.03 13.62 16.45 12 16.45c-2.9127 0-5.389-1.9691-6.269-4.6255L1.8218 15.03C3.8364 19.0473 7.9782 21.8182 12 21.8182c3.12 0 5.9673-1.0364 8.0182-2.8255l-3.9782-3.6527z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.7964-.0763-1.56-.2072-2.3H12v4.51h6.469c-.2782 1.4836-1.1236 2.7382-2.3836 3.589l3.9782 3.6527C22.38 19.6473 23.49 16.2764 23.49 12.27z"
              />
              <path
                fill="#FBBC05"
                d="M5.7309 11.8255a7.085 7.085 0 0 1 0-4.451L1.861 4.1874a11.9566 11.9566 0 0 0 0 10.8255l3.8699-3.1874z"
              />
            </svg>
            Google Account
          </button>
          <button
            type="button"
            className="social-btn social-btn-microsoft"
            onClick={() => setSocialProvider("microsoft")}
          >
            <svg viewBox="0 0 23 23">
              <path fill="#f35325" d="M0 0h11v11H0z" />
              <path fill="#81bc06" d="M12 0h11v11H12z" />
              <path fill="#05a6f0" d="M0 12h11v11H0z" />
              <path fill="#ffba08" d="M12 12h11v11H12z" />
            </svg>
            Microsoft Account
          </button>
        </div>

        <p className="muted" style={{ marginTop: "16px" }}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>

        <SocialAuthModal
          isOpen={!!socialProvider}
          onClose={() => setSocialProvider(null)}
          provider={socialProvider}
          onSelectAccount={handleSocialAuth}
        />
      </section>
    </main>
  );
};

export default Register;

