// src/components/CalendarComponent.jsx
import { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';
import { useCalendar } from '../contexts/CalendarContext';
import { useAuth } from '../contexts/AuthContext';
import TokenCheck from './TokenCheck';
import PopupForm from './PopupForm';

function getApiBase() {
  const env =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL)) ||
    '';
  if (env) return String(env).replace(/\/+$/, '');
  return `${window.location.protocol}//${window.location.hostname}:9090`;
}

export function CalendarComponent({ isDetail = false }) {
  const localizer = useMemo(() => momentLocalizer(moment), []);
  const { loginToken } = useAuth();
  const { events, isLoading, error, refreshEvents } = useCalendar();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    color: '#ffffff',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    isFullDay41250: true,
    startTime: moment().format('HH:mm'),
    endTime: moment().format('HH:mm'),
    isPublish: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Radios will pass string "true"/"false", preserve then coerce during submit
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
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
    setErrorMessage('');
  };

  const handleRefresh = () => refreshEvents();

  const handleSubmit = () => {
    if (!formData.eventName || !formData.startDate) {
      setErrorMessage('Please fill in required fields.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    newEventHandler(formData);
  };

  const newEventHandler = useCallback(
    async (eventData) => {
      const {
        isFullDay,
        color,
        startTime,
        startDate,
        eventName,
        endTime,
        endDate,
        eventDescription,
        isPublish,
      } = eventData;

      const url = `${getApiBase()}/calendar/add`;

      // Coerce booleans safely
      const isFullDayBool = isFullDay === true || String(isFullDay) === 'true';
      const isPublishBool = isPublish === true || String(isPublish) === 'true';

      // Format time as HH:mm
      const formattedStartTime = moment(startTime, 'HH:mm').format('HH:mm');
      const formattedEndTime = moment(endTime, 'HH:mm').format('HH:mm');

      const requestBody = new URLSearchParams({
        is_full_day: String(isFullDayBool),
        color: color || '#ffffff',
        start_date: startDate,
        end_date: endDate || startDate,
        event_name: eventName,
        event_description: eventDescription || '',
        is_publish: String(isPublishBool),
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      });

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${loginToken || ''}`,
          },
          body: requestBody,
        });

        if (!res.ok) {
          let msg = 'Failed to create event';
          try {
            const err = await res.json();
            if (err?.message) msg = err.message;
        } catch (e){
            console.error('Error parsing error response:', e);
        }
          throw new Error(msg);
        }

        await res.json(); // consume response
        await refreshEvents();
        resetForm();
        setShowPopup(false);
      } catch (err) {
        setErrorMessage('Error creating event: ' + (err?.message || 'Unknown error'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginToken, refreshEvents]
  );

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || '#3174ad',
      color: '#fff',
      borderRadius: '5px',
      border: 'none',
    },
  });

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
          <div style={{display:"flex",alignItems: "center",justifyContent: "space-between"}}>
            <div className="text-sm text-gray-600">{events.length} events loaded</div>
              <button
                onClick={handleRefresh}
                disabled={isLoading || isSubmitting}
                className="btn-3d right"
                style={{ margin: '1rem' }}
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
              {/* <TokenCheck>
                <button
                  className="btn-3d"
                  style={{ margin: '1rem' }}
                  onClick={() => setShowPopup(true)}
                  disabled={isSubmitting}
                >
                  Add Event
                </button>
                <PopupForm show={showPopup} onClose={() => !isSubmitting && setShowPopup(false)}>
                  {errorMessage && <div className="text-red-600">{errorMessage}</div>}

                  <label htmlFor="input-name">Name:</label>
                  <input
                    id="input-name"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Name"
                    type="text"
                    required
                  />

                  <label htmlFor="input-description">Description:</label>
                  <textarea
                    id="input-description"
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleInputChange}
                    placeholder="Description"
                  />

                  <label htmlFor="input-color">Color:</label>
                  <input
                    id="input-color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />

                  <label htmlFor="input-start-date">Start Date:</label>
                  <input
                    id="input-start-date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />

                  <label htmlFor="input-end-date">End Date:</label>
                  <input
                    id="input-end-date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />

                  <div>
                    <label>Full Day:</label>
                    <label style={{ marginLeft: 8 }}>
                      <input
                        type="radio"
                        name="isFullDay"
                        value="true"
                        checked={String(formData.isFullDay) === 'true'}
                        onChange={handleInputChange}
                      />
                      Yes
                    </label>
                    <label style={{ marginLeft: 12 }}>
                      <input
                        type="radio"
                        name="isFullDay"
                        value="false"
                        checked={String(formData.isFullDay) === 'false'}
                        onChange={handleInputChange}
                      />
                      No
                    </label>
                  </div>

                  <label htmlFor="input-start-time">Start Time:</label>
                  <input
                    id="input-start-time"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />

                  <label htmlFor="input-end-time">End Time:</label>
                  <input
                    id="input-end-time"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />

                  <div>
                    <label>Publish:</label>
                    <label style={{ marginLeft: 8 }}>
                      <input
                        type="radio"
                        name="isPublish"
                        value="true"
                        checked={String(formData.isPublish) === 'true'}
                        onChange={handleInputChange}
                      />
                      Yes
                    </label>
                    <label style={{ marginLeft: 12 }}>
                      <input
                        type="radio"
                        name="isPublish"
                        value="false"
                        checked={String(formData.isPublish) === 'false'}
                        onChange={handleInputChange}
                      />
                      No
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn-3d"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </PopupForm>
              </TokenCheck> */}
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
            {moment(selectedEvent.start).format('MMM D, YYYY h:mm A')} -{' '}
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

export default CalendarComponent;