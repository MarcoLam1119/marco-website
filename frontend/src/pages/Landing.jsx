// src/pages/Landing.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KEYS, store, debounce } from "../utils/storage.js";
import { useCalendar } from "../contexts/DataContext";
import { SocialIcon } from "../components/SocialIcon.jsx";
import PhotoPreview from "../components/PhotoPreview.jsx";

export default function Landing() {

  const getInitials = (name) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "YN";
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] || "" : "";
    return (first + last).toUpperCase() || first.toUpperCase() || "YN";
  };

  // Previews: About, Photos, Calendar, Tools

  const [photos, setPhotos] = useState(() => store.get(KEYS.PHOTOS, []));
  const [notes, setNotes] = useState(() => store.get(KEYS.NOTES, ""));

  // Calendar events via context
  const { events, isLoading: calLoading, error: calError, refreshEvents } = useCalendar();

  // Keep previews in sync with localStorage changes (cross-tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === KEYS.PHOTOS) {
        setPhotos(store.get(KEYS.PHOTOS, []));
      }
      if (e.key === KEYS.NOTES) {
        setNotes(store.get(KEYS.NOTES, ""));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Derive next 3 upcoming events
  const upcoming = React.useMemo(() => {
    const now = new Date();
    return (events || [])
      .filter((e) => e?.start && new Date(e.start).getTime() >= now.getTime())
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 3);
  }, [events]);

  const contacts = [
    {social:"Gmail" ,text:"marcolamCW1119@gmail.com",url:"mailto:marcolamCW1119@gmail.com"},
    {social:"Whatsapp" ,text:"92087744",url:"https://wa.me/85292087744"},
    {social:"LinkedIn" ,text:"Chun Wing Lam",url:"https://www.linkedin.com/in/chun-wing-lam-308ba4328"},
    {social:"Github" ,text:"MarcoLam1119",url:"https://github.com/MarcoLam1119"},
    {social:"Instagram" ,text:"marco_gaster_lam1119",url:"https://www.instagram.com/marco_gaster_lam1119?igsh=azZuc2p3dTBod3ow&utm_source=qr"},
    {social:"discord",text:"mlgmobile",url:"https://discord.com/users/mlgmobile"}
  ]

  return (
    <>
      {/* Creater */}
      <section id="home">
        <div className="container creater">
          <div className="creater-card">
            <div className="row" style={{ alignItems: "center", padding: "0 0 10px 0"}}>
              <span className="tag" style={{ margin: 0, flex: "0 0 100px" }}>Welcome</span>
              <Link className="right btn" to="/about" aria-label="Go to About page" style={{flex: "0 0 50px"}}>
                Detail
              </Link>
            </div>
            <div className="row">
              <h1 id="createrName">
                Lam Chun Wing (Marco) 
              </h1>
              <div className="avatar center container" aria-label="Avatar" style={{flex:" 0 0 110px"}}>
                {getInitials("Marco Lam")}
              </div>
            </div>
            <p className="muted" id="createrTagline">
              2b || !2b — that is the question. 
            </p>
            <div className="spacer"></div>
            <div className="row">
              {
                contacts.map((contact) => (
                  <span className="pill" key={contact.social}>
                    <SocialIcon 
                      social={contact.social}
                      text={contact.text}
                      url={contact.url}
                    />
                  </span>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* Previews */}
      <section id="previews">
        <div className="container">
          <h2>Explore</h2>
          <div className="grid grid-auto">
            {/* Photo Library Preview */}
            <PhotoPreview limit={3} />

            {/* Calendar Preview */}
            <div className="panel">
              <div className="row" style={{ alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Calendar</h3>
                <Link className="right btn" to="/calendar" aria-label="Go to Calendar page">
                  Detail
                </Link>
              </div>
              {calError ? (
                <div className="small" style={{ color: "tomato", marginTop: 8 }}>
                  {calError} <button className="btn" onClick={refreshEvents} style={{ marginLeft: 8 }}>Retry</button>
                </div>
              ) : calLoading ? (
                <div className="small muted" style={{ marginTop: 8 }}>
                  Loading upcoming events…
                </div>
              ) : upcoming.length ? (
                <ul className="small" style={{ paddingLeft: 18, marginTop: 8 }}>
                  {upcoming.map((e, i) => (
                    <li key={i}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: e.color || "#6aa9ff", marginRight: 6 }} />
                      <strong>{e.title}</strong>{" "}
                      <span className="muted">
                        — {new Date(e.start).toLocaleString(undefined, { dateStyle: "medium", timeStyle: e.allDay ? undefined : "short" })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted" style={{ marginTop: 8 }}>
                  No upcoming events. Create one on the Calendar page.
                </p>
              )}
            </div>

            {/* Tools Preview */}
            <div className="panel">
              <div className="row" style={{ alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Tools</h3>
                <Link className="right btn" to="/tools" aria-label="Go to Tools page">
                  Detail
                </Link>
              </div>
              <div className="small muted" style={{ marginTop: 8 }}>
                Quick Notes chars: <strong className="kpi" style={{ color: "var(--text)" }}>{notes?.length || 0}</strong>
              </div>
              <div className="divider"></div>
              <p className="small muted">
                Includes Notes, Unit Converter, Stopwatch/Timer, and Password Generator.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}