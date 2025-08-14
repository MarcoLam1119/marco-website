import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import CalendarPage from "./pages/Calendar.jsx";
import PhotoLibrary from "./pages/PhotoLibrary.jsx";
import Tools from "./pages/Tools.jsx";
import { KEYS, store } from "./utils/storage.js";


export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const raw = localStorage.getItem(KEYS.THEME);
      return raw ? JSON.parse(raw) : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    store.set(KEYS.THEME, theme);
  }, [theme]);

  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/photos" element={<PhotoLibrary />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}