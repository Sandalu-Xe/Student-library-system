import { useEffect, useMemo, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [bookResponse, borrowingResponse] = await Promise.all([
        api.get("/books"),
        api.get("/borrowings")
      ]);
      setBooks(bookResponse.data.books);
      setBorrowings(borrowingResponse.data.borrowings);
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);
    const activeBorrowings = borrowings.filter((record) => record.status === "borrowed").length;

    return { totalBooks: books.length, totalCopies, availableCopies, activeBorrowings };
  }, [books, borrowings]);

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Hello, {user?.name}</h2>
        </div>
      </div>
      <div className="stats-grid">
        <article className="stat-card">
          <span>Total titles</span>
          <strong>{stats.totalBooks}</strong>
        </article>
        <article className="stat-card">
          <span>Total copies</span>
          <strong>{stats.totalCopies}</strong>
        </article>
        <article className="stat-card">
          <span>Available copies</span>
          <strong>{stats.availableCopies}</strong>
        </article>
        <article className="stat-card">
          <span>Active borrowings</span>
          <strong>{stats.activeBorrowings}</strong>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;

