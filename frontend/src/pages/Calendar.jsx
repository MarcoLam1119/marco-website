// src/pages/Calendar.jsx
import React from 'react';
import CalendarComponent from '../components/CalendarComponent.jsx';

export default function CalendarPage() {
  return (
    <section id="calendar">
      <div className="container">
        <h2>Calendar</h2>
        <div className="panel">
          <CalendarComponent isDetail />
        </div>
      </div>
    </section>
  );
}