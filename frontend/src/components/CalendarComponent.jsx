import { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../AuthContext';

export function CalendarComponent() {
    // 日历本地化设置
    const localizer = momentLocalizer(moment);
    const { loginToken } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);

  
    useEffect(() => {
      const fetchCalendar = async () => {
        try {
          const response = await fetch("http://homepc.marco-lam-web.net:9090/calendar/list", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${loginToken}`
            }
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          let eventLists = data.map(event => ({
            title: event.event_name,
            start: new Date(event.start_date + ' ' + event.start_time),
            end: new Date(event.end_date + ' ' + event.end_time),
            allDay: event.is_full_day,
            backgroundColor: event.color,
            borderColor: event.color
          }));
          // Sort events by start date
          eventLists.sort((a, b) => new Date(a.start) - new Date(b.start));
          setEvents(eventLists);
        } catch (error) {
          console.error("Failed to fetch calendar events:", error);
        }
      };
  
      fetchCalendar();
    }, []);
  
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="bg-teal-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center">
                <i className="fa fa-calendar mr-2"></i> Calendar
            </h2>
            </div>
            <div className="p-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={currentDate}
                onView={setView}
                onNavigate={setCurrentDate}
                onSelectEvent={setSelectedEvent}
                style={{ height: 500, marginBottom: 20 }}
            />
            {selectedEvent && (
                <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-bold text-teal-700 mb-1">Event Details</h3>
                <p className="font-medium">{selectedEvent.title}</p>
                <p>
                    {moment(selectedEvent.start).format('MMM D, YYYY h:mm A')} - 
                    {selectedEvent.allDay ? ' All day' : moment(selectedEvent.end).format(' h:mm A')}
                </p>
                </div>
            )}
            </div>
        </div>
    );
}