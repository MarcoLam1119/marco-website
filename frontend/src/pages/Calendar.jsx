import { CalendarComponent } from '../components/CalendarComponent';
import TokenCheck from '../components/tokenCheck';

export function CalendarPage() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="bg-teal-600 text-black p-4">
        <h2 className="text-xl font-bold flex items-center">
            <i className="fa fa-calendar mr-2">Calendar</i><br/>
        </h2>
        <span className="text-sm text-gray-400">
          This page is a calendar of daily information.
        </span>
      </div>
      <CalendarComponent/>
      <TokenCheck>
        <button onClick={newEventHandler}>Add Event</button>
      </TokenCheck>
    </div>
  );
}

export default CalendarPage;

function newEventHandler(){
  alert("add Event")
  let url = window.location.hostname
  fetch()
}