import React, { useRef, useState } from "react";
import { KEYS, store } from "../utils/storage.js";
import { uuidv4 } from "../utils/id.js";
import PlaceholderSVG from "../components/PlaceholderSVG.jsx";

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState(() => store.get(KEYS.PHOTOS, []));
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef(null);

  React.useEffect(() => {
    try {
      store.set(KEYS.PHOTOS, photos);
    } catch (e) {
      console.warn(e);
    }
  }, [photos]);

  async function handleFiles(files) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const newArr = [...photos];
    for (const f of list) {
      const dataUrl = await compressImageToDataURL(f, 1200, 0.85);
      newArr.unshift({ id: uuidv4(), dataUrl, addedAt: Date.now() });
    }
    try {
      setPhotos(newArr);
    } catch (e) {
      alert("Storage is full. Try removing some photos.");
    }
  }

  function compressImageToDataURL(file, maxDim = 1200, quality = 0.85) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const scale = Math.min(1, maxDim / Math.max(width, height));
          width = Math.round(width * scale);
          height = Math.round(height * scale);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const url = canvas.toDataURL("image/jpeg", quality);
          resolve(url);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const onDragPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section id="photos">
      <div className="container">
        <h2>Photo library</h2>
        <div className="panel">
          <div className="photo-actions">
            <label className="btn" htmlFor="filePicker">
              ➕ Add photos
            </label>
            <input
              type="file"
              id="filePicker"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              id="clearPhotos"
              onClick={() => {
                if (confirm("Remove all stored photos?")) {
                  setPhotos([]);
                  store.del(KEYS.PHOTOS);
                }
              }}
            >
              Clear all
            </button>
            <span className="small muted">Drag & drop images below. Stored locally. Large images are compressed before saving.</span>
          </div>

          <div
            id="dropzone"
            className={`dropzone${dragOver ? " drag" : ""}`}
            aria-label="Drop images here"
            ref={dropRef}
            onDragEnter={(e) => {
              onDragPrevent(e);
              setDragOver(true);
            }}
            onDragOver={onDragPrevent}
            onDragLeave={(e) => {
              onDragPrevent(e);
              setDragOver(false);
            }}
            onDrop={(e) => {
              onDragPrevent(e);
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            Drop images here or use the Add photos button.
          </div>

          <div className="spacer"></div>
          <div id="photogrid" className="photogrid">
            {photos.length > 0
              ? photos.map((p) => (
                  <div className="photo" key={p.id}>
                    <img alt="Photo" loading="lazy" src={p.dataUrl} />
                    <div className="controls">
                      <button
                        className="icon-btn"
                        title="Delete"
                        onClick={() => setPhotos((arr) => arr.filter((x) => x.id !== p.id))}
                      >
                        ✕
                      </button>
                    </div>
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