import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Books from "./pages/Books.jsx";
import Borrowings from "./pages/Borrowings.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const AppShell = ({ children }) => (
  <div className="app-shell">
    <Header />
    <main>{children}</main>
  </div>
);

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loader">Loading library...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route
        path="/"
        element={
          <AppShell>
            <Landing />
          </AppShell>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <AppShell>
              <Books />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrowings"
        element={
          <ProtectedRoute>
            <AppShell>
              <Borrowings />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
