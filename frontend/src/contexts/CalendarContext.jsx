import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const { loginToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchCalendarEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const url = `${window.location.protocol}//${window.location.hostname}:9090/calendar/list`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${loginToken || ''}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events. Please try again.");
      }

      const data = await response.json();
      const eventLists = data.map(event => ({
        title: event.event_name,
        start: new Date(`${event.start_date} ${event.start_time}`),
        end: new Date(`${event.end_date} ${event.end_time}`),
        allDay: event.is_full_day,
        backgroundColor: event.color,
        borderColor: event.color
      })).sort((a, b) => a.start - b.start);

      setEvents(eventLists);
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [loginToken]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [loginToken]); // Call API anytime loginToken changes

  const refreshEvents = useCallback(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const memoizedEvents = useMemo(() => events, [events]);

  const value = {
    events: memoizedEvents,
    isLoading,
    error,
    refreshEvents,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}