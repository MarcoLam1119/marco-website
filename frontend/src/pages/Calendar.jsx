import { CalendarComponent } from '../components/CalendarComponent';


export function CalendarPage() {
  return (
    <main id='calendar-page'>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="bg-teal-600 text-black p-4">
          <h2 className="text-xl font-bold flex items-center">
              <i className="fa fa-calendar mr-2">Calendar</i><br/>
          </h2>
          <span className="text-sm text-gray-400">
            This page is a calendar of daily information.
          </span>
        </div>
        
        <CalendarComponent isDetail={true}/>
        
      </div>
    </main>
  );
}

export default CalendarPage;

