import { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendar } from '../contexts/CalendarContext';

export function CalendarComponent() {
    // Calendar localization settings
    const localizer = momentLocalizer(moment);
    const { events, isLoading, error, refreshEvents } = useCalendar();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Handle refresh button click
    const handleRefresh = () => {
        refreshEvents();
    };

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="text-red-700 font-bold mb-2">Error Loading Calendar</h3>
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={handleRefresh}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Loading indicator */}
            {isLoading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-blue-700">Loading calendar events...</span>
                    </div>
                </div>
            )}

            {/* Refresh button */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    {events.length} events loaded
                </div>
                <button 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

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
    );
}