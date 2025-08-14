// CalendarContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';

const CalendarContext = createContext(undefined);
CalendarContext.displayName = 'CalendarContext';

const getApiBase = () => {
  const envBase =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL);
  if (envBase) return String(envBase).replace(/\/+$/, '');
  return `${window.location.protocol}//${window.location.hostname}:9090`;
};

function parseLocalDateTime(dateStr, timeStr) {
  // Accepts "YYYY-MM-DD" and "HH:mm" or "HH:mm:ss"
  const [y, m, d] = (dateStr || '').split('-').map((n) => parseInt(n, 10));
  const [hh = 0, mm = 0, ss = 0] = (timeStr || '00:00:00').split(':').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0, 0);
}

export function CalendarProvider({ children }) {
  const { loginToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortRef = useRef(null);

  const fetchCalendarEvents = useCallback(async () => {
    // Abort any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    // If no token, clear events and stop
    if (!loginToken) {
      setEvents([]);
      setIsLoading(false);
      setLastUpdated(null);
      return;
    }

    const url = `${getApiBase()}/calendar/list`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${loginToken}` },
        signal: controller.signal,
      });

      if (!response.ok) {
        let msg = 'Failed to fetch events. Please try again.';
        try {
          const errBody = await response.json();
          if (errBody?.message) msg = errBody.message;
        } catch {
            throw new Error(msg);
        }
      }

      const data = await response.json();
      const eventLists = (Array.isArray(data) ? data : []).map((event) => {
        const start = parseLocalDateTime(event.start_date, event.start_time);
        const end = parseLocalDateTime(event.end_date, event.end_time);
        const color = event.color || '#6aa9ff';
        return {
          title: event.event_name,
          start,
          end,
          allDay: Boolean(event.is_full_day),
          color,
          backgroundColor: color,
          borderColor: color,
          // Keep original for reference if needed:
          __raw: event,
        };
      }).sort((a, b) => a.start - b.start);

      setEvents(eventLists);
      setLastUpdated(Date.now());
    } catch (err) {
      if (err.name === 'AbortError') return; // ignore aborted fetches
      console.error('Failed to fetch calendar events:', err);
      setError(err.message || 'Unknown error');
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
        abortRef.current = null;
      }
    }
  }, [loginToken]);

  useEffect(() => {
    fetchCalendarEvents();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchCalendarEvents]);

  const refreshEvents = useCallback(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const value = useMemo(
    () => ({
      events,
      isLoading,
      error,
      lastUpdated,
      refreshEvents,
    }),
    [events, isLoading, error, lastUpdated, refreshEvents]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}