export const store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage error", e);
    }
  },
  del(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error)
    }
  },
};

export const KEYS = {
  THEME: "site_theme",
  CREATER: "site_creater",
  ABOUT: "site_about_v2",
  PHOTOS: "site_photos",
  EVENTS: "site_events",
  NOTES: "site_notes",
};

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}