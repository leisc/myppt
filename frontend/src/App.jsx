import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/create", label: "Create" },
  { to: "/present", label: "Present" }
];

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-badge">MyPPT</span>
          <span>Studio</span>
        </div>
        <nav className="header-links">
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={isActive ? "primary" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
