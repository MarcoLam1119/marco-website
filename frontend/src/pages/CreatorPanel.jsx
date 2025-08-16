// src/pages/CreatorPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import PopupForm from "../components/PopupForm";
import FileDropzone from "../components/Filedropzone"
import {
  getApiBase,
  getCreatorToken,
  saveCreatorToken,
  validateCreatorToken,
  loginCreator,
  logoutCreator,
} from "../lib/creatorAuth";

export default function CreatorPanel() {
  // Auth state (page-scoped)
  const [token, setToken] = useState(() => getCreatorToken());
  const [user, setUser] = useState(null);
  const [authValidating, setAuthValidating] = useState(false);
  const isAuthed = Boolean(token && user);

  // Validate on mount and when token changes
  useEffect(() => {
    let active = true;
    async function run() {
      if (!token) {
        setUser(null);
        return;
      }
      setAuthValidating(true);
      const { ok, user } = await validateCreatorToken(token);
      if (active) {
        setUser(ok ? user : null);
      }
      setAuthValidating(false);
    }
    run();
    return () => {
      active = false;
    };
  }, [token]);

  // Photo upload state
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [photoCategory, setPhotoCategory] = useState("1");
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Login popup state
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
//   const [clientId, setClientId] = useState("string");
//   const [clientSecret, setClientSecret] = useState("string");
  const [scope, setScope] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Notices
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const requireAuth = (action) => {
    if (isAuthed) action();
    else setShowLogin(true);
  };

  async function handlePhotoUpload() {
    if (!photoFile) {
      alert("Please select a file to upload.");
      return;
    }
    setErrorMsg("");
    setNotice("");
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("name", photoName || "");
      formData.append("category_id", photoCategory || "1");
      formData.append("file", photoFile, photoFile.name);

      const res = await fetch(`${getApiBase()}/photos/add`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add photo");
      const created = await res.json();
      setNotice(`Photo created: ${created?.name || photoFile.name}`);
      // reset
      setPhotoName("");
      setPhotoCategory("1");
      setPhotoFile(null);
      setShowPhotoPopup(false);
    } catch (e) {
      setErrorMsg(e?.message || "Upload failed");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  async function doLogin() {
    setLoginError("");
    setIsLoggingIn(true);
    const res = await loginCreator({
      username,
      password,
    //   client_id: clientId,
    //   client_secret: clientSecret,
      scope,
      grant_type: "password",
    });
    setIsLoggingIn(false);

    if (res.ok) {
      setToken(res.token || getCreatorToken());
      setUser(res.user || null);
      setShowLogin(false);
      setUsername("");
      setPassword("");
      setScope("");
      // keep clientId/secret if you want, or clear:
      // setClientId("string"); setClientSecret("string");
    } else {
      setLoginError(res.message || "Login failed");
    }
  }

  function doLogout() {
    logoutCreator();
    setToken("");
    setUser(null);
  }

  function onLoginKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoggingIn && !authValidating) doLogin();
    }
  }

  return (
    <section id="creator-panel">
      <div className="container">
        <h2>Creator Panel</h2>
        <p className="muted">Create and manage content via your API. Login is required only here.</p>

        <div className="panel" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="small">
            Status: {authValidating ? "Validating…" : isAuthed ? "Logged in" : "Logged out"}
          </span>
          {!isAuthed ? (
            <button className="btn" onClick={() => setShowLogin(true)} disabled={authValidating}>
              Login
            </button>
          ) : (
            <button className="btn" onClick={doLogout}>Logout</button>
          )}
        </div>

        {notice && (
          <div className="panel" style={{ borderLeft: "4px solid var(--accent)" }}>
            <div className="small">{notice}</div>
          </div>
        )}
        {errorMsg && (
          <div className="panel" style={{ borderLeft: "4px solid tomato" }}>
            <div className="small" style={{ color: "tomato" }}>{errorMsg}</div>
          </div>
        )}

        <div className="grid grid-auto">
          <div className="panel">
            <div className="row" style={{ alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Add Photos</h3>
              <div className="right">
                <button
                  className="btn"
                  onClick={() => requireAuth(() => setShowPhotoPopup(true))}
                  disabled={authValidating}
                >
                  ➕ Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      <PopupForm show={showPhotoPopup} onClose={() => !isUploadingPhoto && setShowPhotoPopup(false)}>
        <h3 style={{ marginTop: 0 }}>Upload Photo</h3>

        <label htmlFor="photoName">Name</label>
        <input
          id="photoName"
          placeholder="Photo name"
          type="text"
          value={photoName}
          onChange={(e) => setPhotoName(e.target.value)}
        />

        <label htmlFor="photoCategory">Category ID</label>
        <input
          id="photoCategory"
          placeholder="1"
          type="text"
          value={photoCategory}
          onChange={(e) => setPhotoCategory(e.target.value)}
        />

        <label htmlFor="photoFile">File</label>
        <FileDropzone
          id="photoFile"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
        />
        {photoFile && (
          <div className="small muted" style={{ marginTop: 6 }}>
            Selected: {photoFile.name}
          </div>
        )}

        <div className="actions" style={{ marginTop: 12 }}>
          <button className="btn" onClick={handlePhotoUpload} disabled={isUploadingPhoto}>
            {isUploadingPhoto ? "Uploading…" : "Upload"}
          </button>
          <button className="btn" onClick={() => setShowPhotoPopup(false)} disabled={isUploadingPhoto}>
            Cancel
          </button>
        </div>
      </PopupForm>

      {/* Login Modal (no nested form) */}
      <PopupForm show={showLogin} onClose={() => !isLoggingIn && setShowLogin(false)}>
        <h3 style={{ marginTop: 0 }}>Login</h3>

        <div onKeyDown={onLoginKeyDown}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password" style={{ marginTop: 8 }}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {loginError && (
            <div className="small" style={{ color: "tomato", marginTop: 8 }}>{loginError}</div>
          )}

          <div className="divider"></div>

          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" onClick={doLogin} disabled={isLoggingIn || authValidating}>
              {isLoggingIn || authValidating ? "Signing in…" : "Sign in"}
            </button>
            <button type="button" className="btn" onClick={() => setShowLogin(false)} disabled={isLoggingIn}>
              Cancel
            </button>
          </div>
        </div>
      </PopupForm>
    </section>
  );
}