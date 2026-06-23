import { BookOpen, Calendar, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-content">
          <span className="badge">Now Live</span>
          <h1>Welcome to the Digital Library Hub</h1>
          <p className="hero-subtitle">
            A comprehensive, MERN-stack platform to streamline book cataloging, user management, and automated borrowing records.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="primary-button hero-btn">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="primary-button hero-btn">
                  Sign In
                </Link>
                <Link to="/register" className="secondary-button hero-btn">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-title">
          <p className="eyebrow">Key System Features</p>
          <h2>Streamlined Library Management</h2>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon-wrapper">
              <BookOpen size={24} />
            </div>
            <h3>Smart Book Catalog</h3>
            <p>
              Search and filter library catalogs easily by title, author, or ISBN. Manage availability in real time.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={24} />
            </div>
            <h3>Role-Based Access</h3>
            <p>
              Different levels of access for Students, Librarians, and Administrators, keeping catalog moderation secure.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper">
              <Calendar size={24} />
            </div>
            <h3>Borrowing Tracking</h3>
            <p>
              Keep log records of borrowed books, return statuses, and due dates dynamically generated on borrowing actions.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>Secure JWT Auth</h3>
            <p>
              Modern token-based authentication session storage protecting private routes and database transactions.
            </p>
          </article>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-card">
          <div className="about-text">
            <h3>Designed for Modern Library Services</h3>
            <p>
              Whether you are an administrator cataloging new books, a librarian managing borrows, or a student browsing resources, the Digital Library Hub provides a clean, responsive layout built for your workflows.
            </p>
            {!user && (
              <Link to="/register" className="primary-button">
                Get Started Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
