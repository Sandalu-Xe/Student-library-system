import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client.js";

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
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState("");

  const loadBorrowings = async () => {
    const { data } = await api.get("/borrowings");
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

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Records</p>
          <h2>Borrowings</h2>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrower</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((record) => (
              <tr key={record._id}>
                <td>{record.book?.title}</td>
                <td>{record.user?.name}</td>
                <td>{formatDate(record.borrowedAt)}</td>
                <td>{formatDate(record.dueDate)}</td>
                <td>
                  <span className={`status-pill ${record.status}`}>{record.status}</span>
                </td>
                <td>
                  {record.status === "borrowed" && (
                    <button className="secondary-button" type="button" onClick={() => returnBook(record._id)}>
                      <RotateCcw size={17} />
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Borrowings;

