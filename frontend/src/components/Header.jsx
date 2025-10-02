import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import NetworkStatus from "./NetworkStatus.jsx";

export default function Header({ onToggleTheme }) {
  const navRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (open) nav.classList.add("open");
    else nav.classList.remove("open");
  }, [open]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handler = (e) => {
      if (e.target.tagName === "A") setOpen(false);
    };
    nav.addEventListener("click", handler);
    return () => nav.removeEventListener("click", handler);
  }, []);

  return (
    <header>
      <div className="container nav">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <span>My Personal Web</span>
        </div>
        <nav className="navlinks" id="navlinks" aria-label="Primary" ref={navRef}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>
            About me
          </NavLink>
          <NavLink to="/photos" className={({ isActive }) => (isActive ? "active" : undefined)}>
            Photos
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : undefined)}>
            Calendar
          </NavLink>
          <NavLink to="/tools" className={({ isActive }) => (isActive ? "active" : undefined)}>
            Tools
          </NavLink>
        </nav>
        <div className="nav-rt">
          <NetworkStatus />
          <button className="icon-btn" title="Toggle theme" aria-label="Toggle theme" onClick={onToggleTheme}>
            🌓
          </button>
          <button
            className="icon-btn hamburger"
            id="hamburger"
            aria-label="Toggle navigation"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
