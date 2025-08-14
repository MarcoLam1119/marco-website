// DataContext.jsx
// Unified context exports and a combined provider

export { AuthProvider, useAuth } from './AuthContext';
export { CalendarProvider, useCalendar } from './CalendarContext';

import { AuthProvider } from './AuthContext';
import { CalendarProvider } from './CalendarContext';

export function DataProvider({ children }) {
  return (
    <AuthProvider>
      <CalendarProvider>{children}</CalendarProvider>
    </AuthProvider>
  );
}