import { Check, RotateCcw, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date(value));
};

const Borrowings = () => {
  const { isStaff, user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadBorrowings = async (query = search) => {
    const { data } = await api.get("/borrowings", { params: { search: query } });
    setBorrowings(data.borrowings);
  };

  useEffect(() => {
    loadBorrowings();
  }, []);

  const returnBook = async (id) => {
    setError("");
    try {
      await api.patch(`/borrowings/${id}/return`);
      await loadBorrowings();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Return failed");
    }
  };

  const confirmBooking = async (id) => {
    setError("");
    try {
      await api.patch(`/borrowings/${id}/confirm`);
      await loadBorrowings();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Confirmation failed");
    }
  };

  const cancelBooking = async (id) => {
    setError("");
    try {
      await api.delete(`/borrowings/${id}`);
      await loadBorrowings();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Cancellation failed");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBorrowings();
  };

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Records</p>
          <h2>{isStaff ? "Library Borrowings & Bookings" : "My Borrowings & Bookings"}</h2>
        </div>
        {isStaff && (
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Student ID, name, email"
            />
            <button type="submit" className="primary-button admin-theme-btn" style={{ minHeight: "38px" }}>
              Search
            </button>
          </form>
        )}
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrower</th>
              <th>Student ID</th>
              <th>Borrowed/Booked</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                  No borrowing or booking records found.
                </td>
              </tr>
            ) : (
              borrowings.map((record) => {
                const isRecordOwner = record.user?._id === user?._id;
                return (
                  <tr key={record._id}>
                    <td>
                      <div>
                        <strong>{record.book?.title}</strong>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          ISBN: {record.book?.isbn}
                        </div>
                      </div>
                    </td>
                    <td>{record.user?.name}</td>
                    <td>{record.user?.studentId || "N/A"}</td>
                    <td>{formatDate(record.status === "booked" ? record.createdAt : record.borrowedAt)}</td>
                    <td>{formatDate(record.dueDate)}</td>
                    <td>
                      <span className={`status-pill ${record.status}`}>{record.status}</span>
                    </td>
                    <td>
                      <div className="action-cell">
                        {isStaff && record.status === "booked" && (
                          <button
                            className="primary-button"
                            style={{ background: "#16a34a" }}
                            type="button"
                            onClick={() => confirmBooking(record._id)}
                            title="Confirm pickup"
                          >
                            <Check size={16} />
                            Issue Book
                          </button>
                        )}
                        {isStaff && record.status === "borrowed" && (
                          <button
                            className="secondary-button"
                            type="button"
                            onClick={() => returnBook(record._id)}
                            title="Return Book"
                          >
                            <RotateCcw size={16} />
                            Return
                          </button>
                        )}
                        {(isStaff || (isRecordOwner && record.status === "booked")) && (
                          <button
                            className="icon-button danger"
                            type="button"
                            onClick={() => cancelBooking(record._id)}
                            title="Cancel Booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Borrowings;

