import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import moment from 'moment';
// import { gsap } from "gsap"

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

// 主组件
export default function Landing() {
  return (
    <main id="landing" >
    {/* // className="min-h-screen bg-gray-50 text-gray-800"> */}
        {previewOfAboutMe()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {previewOfPhotoLibrary()}
        {previewOfGameCenter()}
        {previewOfCalendar()}
        {previewOfToolCenter()}
      </div>
    </main>
  );
}

// 关于我
export function previewOfAboutMe() {
  return (
    <div id="previewOfAboutMe" className="bg-gradient-to-br from-blue-900 to-indigo-700 text-white py-20 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="w-64 h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-105 transition-transform">
            <img src="https://picsum.photos/id/1005/400/400" alt="Marco Lam" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-2">Hello, I'm</h1>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">Marco Lam</h1>
          <p className="text-xl md:text-2xl mb-6 max-w-xl mx-auto md:mx-0">I'm a software engineer with a passion for building web applications.</p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              View Portfolio
            </a>
            <a href="#" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 hover:-translate-y-1 transition-all">
              Contact Me
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}

// 照片库
export function previewOfPhotoLibrary() {
  const photos = [
    'https://picsum.photos/id/1015/800/600',
    'https://picsum.photos/id/1016/800/600',
    'https://picsum.photos/id/1018/800/600',
    'https://picsum.photos/id/1019/800/600',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-camera mr-2"></i> Photo Library
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {photos.map((photo, i) => (
            <div key={i} className="overflow-hidden rounded-lg hover:scale-105 transition-transform">
              <img src={photo} alt={`Photo ${i+1}`} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors">
          View All Photos
        </button>
      </div>
    </div>
  );
}

// 游戏中心
export function previewOfGameCenter() {
  const games = [
    { name: 'Tic Tac Toe', icon: 'fa-gamepad' },
    { name: 'Memory Match', icon: 'fa-puzzle-piece' },
    { name: 'Snake', icon: 'fa-paw' },
    { name: 'Quiz', icon: 'fa-question-circle' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="bg-purple-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-gamepad mr-2"></i> Game Center
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {games.map((game, i) => (
            <button key={i} className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <i className={`fa ${game.icon} text-2xl text-purple-600 mb-2`}></i>
              <span className="font-medium">{game.name}</span>
            </button>
          ))}
        </div>
        <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
          View All Games
        </button>
      </div>
    </div>
  );
}

// 日历组件
export function previewOfCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

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

// 工具中心
export function previewOfToolCenter() {
  const tools = [
    { name: 'Calculator', icon: 'fa-calculator' },
    { name: 'Timer', icon: 'fa-clock-o' },
    { name: 'Unit Converter', icon: 'fa-exchange' },
    { name: 'Password Generator', icon: 'fa-key' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="bg-amber-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-wrench mr-2"></i> Tool Center
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool, i) => (
            <button key={i} className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <i className={`fa ${tool.icon} text-2xl text-amber-600 mb-2`}></i>
              <span className="font-medium">{tool.name}</span>
            </button>
          ))}
        </div>
        <button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors">
          View All Tools
        </button>
      </div>
    </div>
  );
}