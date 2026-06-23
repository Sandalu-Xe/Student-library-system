import { useState } from "react";

const SocialAuthModal = ({ isOpen, onClose, provider, onSelectAccount }) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isGoogle = provider === "google";
  const brandName = isGoogle ? "Google" : "Microsoft";

  // Brand color representation
  const avatarClass = isGoogle ? "google" : "microsoft";

  // Pre-configured accounts for testing
  const preconfiguredAccounts = isGoogle
    ? [
        { name: "John Doe", email: "john.doe@gmail.com", avatarLetter: "J" },
        { name: "Jane Smith", email: "jane.smith@gmail.com", avatarLetter: "J" }
      ]
    : [
        { name: "John Doe", email: "john.doe@outlook.com", avatarLetter: "J" },
        { name: "Jane Smith", email: "jane.smith@outlook.com", avatarLetter: "J" }
      ];

  const handleSelectPreconfigured = async (account) => {
    setLoading(true);
    setError("");
    try {
      await onSelectAccount({
        name: account.name,
        email: account.email,
        provider,
        providerId: `${provider}_123456789_${account.email.split("@")[0]}`
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customForm.name.trim() || !customForm.email.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSelectAccount({
        name: customForm.name.trim(),
        email: customForm.email.trim(),
        provider,
        providerId: `${provider}_custom_${Date.now()}`
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  // Google multi-color G logo SVG
  const googleLogo = (
    <svg viewBox="0 0 24 24" width="36" height="36">
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
  );

  // Microsoft 4-square grid logo SVG
  const microsoftLogo = (
    <svg viewBox="0 0 23 23" width="36" height="36">
      <path fill="#f35325" d="M0 0h11v11H0z" />
      <path fill="#81bc06" d="M12 0h11v11H12z" />
      <path fill="#05a6f0" d="M0 12h11v11H0z" />
      <path fill="#ffba08" d="M12 12h11v11H12z" />
    </svg>
  );

  return (
    <div className="social-modal-overlay" onClick={onClose}>
      <div className="social-modal" onClick={(e) => e.stopPropagation()}>
        <button className="social-modal-close" onClick={onClose} aria-label="Close dialog">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="social-modal-header">
          <div className="logo-wrapper">
            {isGoogle ? googleLogo : microsoftLogo}
          </div>
          <h2>Sign in with {brandName}</h2>
          <p>to continue to Student Library System</p>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="page-loader" style={{ minHeight: "auto" }}>
              Authenticating with {brandName}...
            </div>
          </div>
        ) : (
          <>
            {!showCustomForm ? (
              <>
                <div className="social-account-list">
                  {preconfiguredAccounts.map((acc, index) => (
                    <button
                      key={index}
                      className="social-account-item"
                      onClick={() => handleSelectPreconfigured(acc)}
                    >
                      <div className={`social-avatar ${avatarClass}`}>
                        {acc.avatarLetter}
                      </div>
                      <div className="social-account-details">
                        <span className="social-account-name">{acc.name}</span>
                        <span className="social-account-email">{acc.email}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  className="social-custom-trigger"
                  onClick={() => setShowCustomForm(true)}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Use another account
                </button>
              </>
            ) : (
              <form onSubmit={handleCustomSubmit} className="social-custom-form">
                <label>
                  Full Name
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={customForm.email}
                    onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                    required
                  />
                </label>
                <button type="submit" className="primary-button" style={{ marginTop: "10px" }}>
                  Sign in
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowCustomForm(false);
                    setError("");
                  }}
                >
                  Back to accounts
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SocialAuthModal;
