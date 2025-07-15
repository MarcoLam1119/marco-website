import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import moment from 'moment';

// 日历本地化设置
const localizer = momentLocalizer(moment); 

// 示例日历事件
const events = [
  {
    title: 'Team Meeting',
    start: new Date(),
    end: new Date(Date.now() + 3600000),
    backgroundColor: '#1E88E5',
  },
  {
    title: 'Lunch',
    start: new Date(new Date().setHours(12, 0)),
    end: new Date(new Date().setHours(13, 0)),
    backgroundColor: '#43A047',
  },
  {
    title: 'Project Deadline',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: true,
    backgroundColor: '#E53935',
  },
];
export function MyCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
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
          style={{ height: '60vh' , paddingBottom: 20}}
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

export default MyCalendar;