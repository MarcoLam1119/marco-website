// src/pages/PhotoLibrary.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import PlaceholderSVG from "../components/PlaceholderSVG.jsx";

function getApiBase() {
  return `${window.location.protocol}//${window.location.hostname}:9090`;
}

function imageUrl(upload_location) {
  if (!upload_location) return "";
  // Your API returns a relative upload_location; serve from same origin
  return `${window.location.origin}/${String(upload_location).replace(/^\/+/, "")}`;
}

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterValue, setFilterValue] = useState("0"); // "0" = ALL
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch(`${getApiBase()}/photos/list`),
        fetch(`${getApiBase()}/category/list`),
      ]);

      if (!photosRes.ok) throw new Error(`Photos fetch failed: ${photosRes.status}`);
      if (!catsRes.ok) throw new Error(`Categories fetch failed: ${catsRes.status}`);

      const [photosData, catsData] = await Promise.all([photosRes.json(), catsRes.json()]);
      setPhotos(Array.isArray(photosData) ? photosData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg(err?.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredPhotos = useMemo(() => {
    if (!Array.isArray(photos) || photos.length === 0) return [];
    if (filterValue === "0") return photos;
    // Ensure loose equality if API uses numbers; normalize to string compare
    return photos.filter((p) => String(p.category_id) === String(filterValue));
  }, [photos, filterValue]);

  return (
    <section id="photos">
      <div className="container">
        <h2>Photo library</h2>
        <div className="panel">
          <div className="photo-actions" style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap",justifyContent: "space-between" }}>
            {/*
              TODO make this filter to click one button only more UX 
              e.g. list all with check btn
            */}
            <div>
              <label htmlFor="categoryFilter">Category</label>
              <select
                style={{ width:"200px"}}
                id="categoryFilter"
                className="category-filter"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                disabled={isLoading}
              >
                <option value="0">ALL</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <button className="btn" onClick={fetchAll} disabled={isLoading}>
                {isLoading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="small" style={{ color: "tomato", marginTop: 8 }}>
              {errorMsg}
            </div>
          )}

          {isLoading && (
            <div className="small muted" style={{ marginTop: 8 }}>
              Loading…
            </div>
          )}

          <div className="spacer"></div>
          <div id="photogrid" className="photogrid">
            {filteredPhotos.length > 0 ? (
              filteredPhotos.map((photo) => {
                const src = imageUrl(photo.upload_location);
                return (
                  <div className="photo" key={photo.id} data-category={photo.category_id}>
                    {src ? (
                      <img alt={photo.name || "Photo"} loading="lazy" src={src} />
                    ) : (
                      <PlaceholderSVG i={photo.id} />
                    )}
                  </div>
                );
              })
            ) : photos.length === 0 && !isLoading && !errorMsg ? (
              // Initial empty state
              Array.from({ length: 6 }).map((_, i) => (
                <div className="photo" key={`ph-${i}`}>
                  <PlaceholderSVG i={i} />
                </div>
              ))
            ) : (
              // Filter resulted in zero items
              !isLoading &&
              !errorMsg && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className="photo" key={`ph-${i}`}>
                      <PlaceholderSVG i={i} />
                    </div>
                  ))}
                  <div className="small muted" style={{ padding: 8 }}>
                    No photos match this category.
                  </div>
                </>
              )
              
            )}
          </div>
        </div>
      </div>
    </section>
  );
}