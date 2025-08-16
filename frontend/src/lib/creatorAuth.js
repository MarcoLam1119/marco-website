// src/lib/creatorAuth.js
export function getApiBase() {
  return `${window.location.protocol}//${window.location.hostname}:9090`;
}

// Local storage key for this page’s auth
const KEY = "creatorToken";

export function getCreatorToken() {
  return localStorage.getItem(KEY) || "";
}

export function saveCreatorToken(token) {
  if (token) localStorage.setItem(KEY, token);
  else localStorage.removeItem(KEY);
}

export async function validateCreatorToken(token) {
  if (!token) return { ok: false, user: null };
  try {
    const res = await fetch(`${getApiBase()}/auth/validate`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return { ok: false, user: null };
    const data = await res.json();
    return { ok: true, user: data?.user ?? data ?? { id: "me" } };
  } catch {
    return { ok: false, user: null };
  }
}

/**
 * Grouped login action for Creator Panel.
 * - Sends application/x-www-form-urlencoded to /auth/login
 * - Saves token to localStorage
 * - Validates token and returns { ok, token, user, message }
 */
export async function loginCreator({
  username,
  password,
  client_id = "string",
  client_secret = "string",
  scope = "",
  grant_type = "password",
}) {
  const params = new URLSearchParams();
  params.set("grant_type", grant_type);
  params.set("username", username);
  params.set("password", password);
  params.set("scope", scope);
  params.set("client_id", client_id);
  params.set("client_secret", client_secret);

  try {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      let msg = "Login failed";
      try {
        const e = await res.json();
        msg = e?.detail || e?.message || msg;
      } catch {}
      return { ok: false, message: msg };
    }

    const data = await res.json();
    const token = data?.access_token || data?.token;
    if (!token) return { ok: false, message: "No access_token in response" };

    saveCreatorToken(token);
    const { ok, user } = await validateCreatorToken(token);
    return { ok, token, user, message: ok ? "OK" : "Token validation failed" };
  } catch (err) {
    return { ok: false, message: err?.message || "Login error" };
  }
}

export function logoutCreator() {
  saveCreatorToken("");
}