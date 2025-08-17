// src/components/PhotoPreview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function getApiBase() {
  return `${window.location.protocol}//${window.location.hostname}:9090`;
}

const toImgUrl = (upload_location) => `${window.location.origin}/${upload_location}`;

export default function PhotoPreview({ limit = 3, pollMs = 0 }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchPhotos = async () => {
    setIsLoading(true);
    setErr("");
    try {
      const res = await fetch(`${getApiBase()}/photos/list`);
      if (!res.ok) throw new Error("Failed to load photos");
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Error fetching photos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Optional polling (disabled by default)
  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(fetchPhotos, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  const visible = useMemo(() => photos.slice(0, limit), [photos, limit]);

  return (
    <div className="panel">
      <div className="row" style={{ alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Photo library</h3>
          
          <Link className="right btn" to="/photos" aria-label="Go to Photo page">
            Detail
          </Link>
      </div>

      {err && (
        <div className="small" style={{ color: "tomato", marginTop: 8 }}>
          {err}
        </div>
      )}

      {isLoading && !photos.length && (
        <div className="small muted" style={{ marginTop: 8 }}>
          Loading photos…
        </div>
      )}

      {visible.length ? (
        <div className="photogrid" style={{ marginTop: 8 }}>
          {visible.map((p) => (
            <div className="photo" key={p.id}>
              <img alt={p.name || "Photo"} loading="lazy" src={toImgUrl(p.upload_location)} />
            </div>
          ))}
        </div>
      ) : !isLoading ? (
         <button className="btn" onClick={fetchPhotos} disabled={isLoading} aria-label="Refresh photos">
            {isLoading ? "Refreshing…" : "Refresh"}
          </button>
      ) : null}
    </div>
  );
}