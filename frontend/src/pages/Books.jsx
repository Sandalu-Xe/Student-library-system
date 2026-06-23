import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publishedYear: "",
  totalCopies: 1,
  shelfLocation: "General"
};

const Books = () => {
  const { isStaff } = useAuth();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBooks = async () => {
    const { data } = await api.get("/books", { params: { search } });
    setBooks(data.books);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        totalCopies: Number(form.totalCopies)
      };

      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
        setMessage("Book updated");
      } else {
        await api.post("/books", payload);
        setMessage("Book added");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadBooks();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Book save failed");
    }
  };

  const editBook = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishedYear: book.publishedYear || "",
      totalCopies: book.totalCopies,
      shelfLocation: book.shelfLocation || "General"
    });
  };

  const deleteBook = async (bookId) => {
    setError("");
    setMessage("");

    try {
      await api.delete(`/books/${bookId}`);
      setMessage("Book deleted");
      await loadBooks();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Delete failed");
    }
  };

  const borrowBook = async (bookId) => {
    setError("");
    setMessage("");

    try {
      await api.post("/borrowings", { bookId });
      setMessage("Book borrowed");
      await loadBooks();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Borrow failed");
    }
  };

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Books</h2>
        </div>
        <form
          className="search-bar"
          onSubmit={(event) => {
            event.preventDefault();
            loadBooks();
          }}
        >
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, ISBN"
          />
        </form>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="alert">{error}</div>}

      {isStaff && (
        <form className="book-form" onSubmit={handleSubmit}>
          <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <input placeholder="Author" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required />
          <input placeholder="ISBN" value={form.isbn} onChange={(event) => setForm({ ...form, isbn: event.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
          <input placeholder="Year" type="number" value={form.publishedYear} onChange={(event) => setForm({ ...form, publishedYear: event.target.value })} />
          <input placeholder="Copies" type="number" min="1" value={form.totalCopies} onChange={(event) => setForm({ ...form, totalCopies: event.target.value })} required />
          <input placeholder="Shelf" value={form.shelfLocation} onChange={(event) => setForm({ ...form, shelfLocation: event.target.value })} />
          <button type="submit" className="primary-button">
            <Plus size={18} />
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      )}

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Copies</th>
              <th>Shelf</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>
                  {book.availableCopies}/{book.totalCopies}
                </td>
                <td>{book.shelfLocation}</td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => borrowBook(book._id)}
                    disabled={book.availableCopies < 1}
                  >
                    Borrow
                  </button>
                  {isStaff && (
                    <>
                      <button className="icon-button" type="button" title="Edit" onClick={() => editBook(book)}>
                        <Edit size={17} />
                      </button>
                      <button className="icon-button danger" type="button" title="Delete" onClick={() => deleteBook(book._id)}>
                        <Trash2 size={17} />
                      </button>
                    </>
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

export default Books;

