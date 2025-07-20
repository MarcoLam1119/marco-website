import { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendar } from '../contexts/CalendarContext';
import PropTypes from 'prop-types';
import TokenCheck from './tokenCheck';
import PopupForm from './PopupForm';
import { useAuth } from '../contexts/AuthContext';

export function CalendarComponent({ isDetail = false }) {
    const localizer = momentLocalizer(moment);
    const { loginToken } = useAuth();
    const { events, isLoading, error, refreshEvents } = useCalendar();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        eventDescription: '',
        color: '#ffffff',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        isFullDay: true,
        startTime: moment().format('HH:mm'),
        endTime: moment().format('HH:mm'),
        isPublish: true,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRefresh = () => {
        refreshEvents();
    };

    const handleSubmit = () => {
        if (!formData.eventName || !formData.startDate) {
            setErrorMessage('Please fill in required fields.');
            return;
        }
        setErrorMessage('');
        
        setIsSubmitting(true);
        newEventHandler(formData);
    };

    function newEventHandler(eventData) {
      const { isFullDay, color, startTime, startDate, eventName, endTime, endDate, eventDescription, isPublish } = eventData;
  
      const url = 'http://localhost:9090/calendar/add';
      const requestBody = new URLSearchParams({
          is_full_day: isFullDay,
          color: color,
          start_date: startDate, // Ensure this is formatted correctly
          end_date: endDate, // Ensure this is formatted correctly
          event_name: eventName,
          event_description: eventDescription,
          is_publish: isPublish,
      });
  
      // Construct start and end time correctly
      const formattedStartTime = moment(startTime, 'HH:mm').format('HH:mm');
      const formattedEndTime = moment(endTime, 'HH:mm').format('HH:mm');
  
      requestBody.append('start_time', formattedStartTime);
      requestBody.append('end_time', formattedEndTime);
  
      fetch(url, {
          method: 'POST',
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${loginToken}`,
          },
          body: requestBody,
      })
      .then(response => {
          if (!response.ok) throw new Error('Failed to create event');
          return response.json();
      })
      .then(data => {
          console.log('Success:', data);
          refreshEvents();
          setIsSubmitting(false); // Always reset isSubmitting after success
          // Reset form data here
      })
      .catch((error) => {
          setErrorMessage('Error creating event: ' + error.message);
          setIsSubmitting(false); // Always reset isSubmitting after error
      });
    }

    // Set event color according to event.color
    const eventStyleGetter = (event) => {
      return {
        style: {
          backgroundColor: event.color || '#3174ad', // default color if not set
          color: '#fff',
          borderRadius: '5px',
          border: 'none',
        }
      };
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
            {isDetail && (
                <>
                    {isLoading && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-blue-700">Loading calendar events...</span>
                            </div>
                        </div>
                    )}
                    <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">{events.length} events loaded</div>
                        <button 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="btn-3d"
                        >
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </button>
                        <TokenCheck>
                            <button
                                className="btn-3d"
                                style={{ margin: "1rem" }}
                                onClick={() => setShowPopup(true)}
                            >
                                Add Event
                            </button>
                            <PopupForm show={showPopup} onClose={() => setShowPopup(false)}>
                                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                                <label htmlFor='input-name'>Name:</label>
                                <input
                                    id='input-name'
                                    name='eventName'
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    type='text'
                                    required
                                />
                                <label htmlFor='input-description'>Description:</label>
                                <textarea
                                    id='input-description'
                                    name='eventDescription'
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                ></textarea>
                                <label htmlFor='input-color'>Color:</label>
                                <input
                                    id='input-color'
                                    name='color'
                                    type='color'
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='input-start-date'>Start Date:</label>
                                <input
                                    id='input-start-date'
                                    name='startDate'
                                    type='date'
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor='input-end-date'>End Date:</label>
                                <input
                                    id='input-end-date'
                                    name='endDate'
                                    type='date'
                                    onChange={handleInputChange}
                                />
                                <div>
                                    <label>Full Day:</label>
                                    <input
                                        type='radio'
                                        name='isFullDay'
                                        value={true}
                                        onChange={handleInputChange}
                                    />Yes
                                    <input
                                        type='radio'
                                        name='isFullDay'
                                        value={false}
                                        onChange={handleInputChange}
                                    />No
                                </div>
                                <label htmlFor='input-start-time'>Start Time:</label>
                                <input
                                    id='input-start-time'
                                    name='startTime'
                                    type='time'
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='input-end-time'>End Time:</label>
                                <input
                                    id='input-end-time'
                                    name='endTime'
                                    type='time'
                                    onChange={handleInputChange}
                                />
                                <div>
                                    <label>Publish:</label>
                                    <input
                                        type='radio'
                                        name='isPublish'
                                        value={true}
                                        onChange={handleInputChange}
                                    />Yes
                                    <input
                                        type='radio'
                                        name='isPublish'
                                        value={false}
                                        onChange={handleInputChange}
                                    />No
                                </div>
                                <button
                                    type='button'
                                    className='btn-3d'
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </PopupForm>
                        </TokenCheck>
                    </div>
                </>
            )}
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
                eventPropGetter={eventStyleGetter}
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

CalendarComponent.propTypes = {
    isDetail: PropTypes.bool,
};