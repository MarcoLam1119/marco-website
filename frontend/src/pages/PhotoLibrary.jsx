// src/pages/PhotoLibrary.jsx
import React, { useEffect, useState, useCallback } from "react";
import PlaceholderSVG from "../components/PlaceholderSVG.jsx";

function getApiBase() {
  return `${window.location.protocol}//${window.location.hostname}:9090`;
}

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const imageUrl = (upload_location) => `${window.location.origin}/${upload_location}`;

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${getApiBase()}/photos/list`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch photos:", err);
      setErrorMsg(err?.message || "Failed to fetch photos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <section id="photos">
      <div className="container">
        <h2>Photo library</h2>
        <div className="panel">
          <div className="photo-actions">
            <button className="btn" onClick={fetchPhotos} disabled={isLoading}>
              {isLoading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {errorMsg && (
            <div className="small" style={{ color: "tomato", marginTop: 8 }}>
              {errorMsg}
            </div>
          )}

          {isLoading && (
            <div className="small muted" style={{ marginTop: 8 }}>
              Loading photos…
            </div>
          )}

          <div className="spacer"></div>
          <div id="photogrid" className="photogrid">
            {photos.length > 0
              ? photos.map((photo) => (
                  <div className="photo" key={photo.id}>
                    <img alt={photo.name || "Photo"} loading="lazy" src={imageUrl(photo.upload_location)} />
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div className="photo" key={i}>
                    <PlaceholderSVG i={i} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}