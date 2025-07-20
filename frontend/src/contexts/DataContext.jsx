// DataContext.jsx - Unified context for all application data
// This file groups up all content in contexts folder in one file

// Import all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { CalendarProvider, useCalendar } from './CalendarContext'; 

// Combined Data Provider that wraps both Auth and Calendar
import { AuthProvider } from './AuthContext';
import { CalendarProvider } from './CalendarContext';

export function DataProvider({ children }) {
  return (
    <AuthProvider>
      <CalendarProvider>
        {children}
      </CalendarProvider>
    </AuthProvider>
  );
}

