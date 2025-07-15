import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';

export default function Landing() {
  return (
    <main id="landing" className="min-h-screen bg-gray-50 text-gray-800 font-sans">
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

export function previewOfAboutMe() {
  return (
    <div id="previewOfAboutMe" className="relative bg-gradient-to-br from-blue-900 to-indigo-700 text-white py-24 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="w-64 h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-500 hover:scale-105">
            <img src="https://picsum.photos/id/1005/400/400" alt="Marco Lam" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-2 transform transition-transform duration-500 hover:translate-x-2">Hello, I'm</h1>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 transform transition-transform duration-500 hover:translate-x-4">Marco Lam</h1>
          <p className="text-xl md:text-2xl mb-6 max-w-xl mx-auto md:mx-0 transform transition-transform duration-500 hover:translate-x-2">I'm a software engineer with a passion for building web applications.</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              View Portfolio
            </a>
            <a href="#" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
              Contact Me
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}

export function previewOfPhotoLibrary() {
  const [photos] = useState([
    'https://picsum.photos/id/1015/800/600',
    'https://picsum.photos/id/1016/800/600',
    'https://picsum.photos/id/1018/800/600',
    'https://picsum.photos/id/1019/800/600',
  ]);

  return (
    <div id="previewOfPhotoLibrary" className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-camera mr-2"></i> Photo Library
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {photos.map((photo, index) => (
            <div key={index} className="overflow-hidden rounded-lg transform transition-transform duration-300 hover:scale-105">
              <img src={photo} alt={`Gallery photo ${index + 1}`} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors duration-300">
          View All Photos
        </button>
      </div>
    </div>
  );
}

export function previewOfGameCenter() {
  const [games] = useState([
    { name: 'Tic Tac Toe', icon: 'fa-gamepad' },
    { name: 'Memory Match', icon: 'fa-puzzle-piece' },
    { name: 'Snake', icon: 'fa-paw' },
    { name: 'Quiz', icon: 'fa-question-circle' },
  ]);

  return (
    <div id="previewOfGameCenter" className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-purple-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-gamepad mr-2"></i> Game Center
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {games.map((game, index) => (
            <button key={index} className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              <i className={`fa ${game.icon} text-2xl text-purple-600 mb-2`}></i>
              <span className="font-medium">{game.name}</span>
            </button>
          ))}
        </div>
        <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors duration-300">
          View All Games
        </button>
      </div>
    </div>
  );
}

export function previewOfCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div id="previewOfCalendar" className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-teal-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-calendar mr-2"></i> Calendar
        </h2>
      </div>
      <div className="p-4">
        <Calendar
          onChange={setDate}
          value={date}
          className="w-full"
        />
        <div className="mt-4 p-3 bg-teal-50 rounded-lg">
          <h3 className="font-bold text-teal-700 mb-1">Selected Date:</h3>
          <p>{date.toDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export function previewOfToolCenter() {
  const [tools] = useState([
    { name: 'Calculator', icon: 'fa-calculator' },
    { name: 'Timer', icon: 'fa-clock-o' },
    { name: 'Unit Converter', icon: 'fa-exchange' },
    { name: 'Password Generator', icon: 'fa-key' },
  ]);

  return (
    <div id="previewOfToolCenter" className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-amber-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa fa-wrench mr-2"></i> Tool Center
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool, index) => (
            <button key={index} className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              <i className={`fa ${tool.icon} text-2xl text-amber-600 mb-2`}></i>
              <span className="font-medium">{tool.name}</span>
            </button>
          ))}
        </div>
        <button className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors duration-300">
          View All Tools
        </button>
      </div>
    </div>
  );
}  