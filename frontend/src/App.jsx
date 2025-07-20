import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import AboutMe from './pages/AboutMe.jsx';
import GameCenter from './pages/GameCenter.jsx';
import PhotoLibrary from './pages/PhotoLibrary.jsx';
import CalendarPage from './pages/Calendar.jsx';
import TetrisGame from './pages/GameCenter/TetrisGame.jsx';
import TicTacToeGame from './pages/GameCenter/TicTacToeGame.jsx';
import DivRow from './components/DivRow.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { CalendarProvider } from './contexts/CalendarContext';

import './css/Header.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/style.scss';

export default function App() {

  const links = [
    { to: "/", label: "Landing", element: <Landing /> },
    { to: "/about-me", label: "About Me", element: <AboutMe /> },
    { to: "/game-center", label: "Game Center", element: <GameCenter /> },
    { to: "/photo-library", label: "Photo Library", element: <PhotoLibrary /> },
    { to: "/calendar", label: "Calendar", element: <CalendarPage /> },
  ];

  return ( 
    <Router>
      <Header links={links} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/game-center" element={<GameCenter />} />
        <Route path="/photo-library" element={<PhotoLibrary />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/game-center/tetris-game" element={<TetrisGame />} />
        <Route path="/game-center/tic-tac-toe-game" element={<TicTacToeGame />} />
      </Routes>
    </Router>
  );
}

function Header({ links }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3>Marco Webpage</h3>
      <DivRow>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              textDecoration: isActive ? 'underline' : 'none',
              color: isActive ? '#61dafb' : '#FFF',
            })}
          >
            {link.label}
          </NavLink>
        ))}
        <AdminLogin />
      </DivRow>
    </header>
  );
}

function AdminLogin() {
  const { saveToken, loginToken, removeToken } = useAuth(); // ✅ Correct: use at component top level

  const handleLogin = async () => {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    try {
      const response = await fetch("http://localhost:9090/auth/login", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=password&username=${username}&password=${password}&scope=&client_id=string&client_secret=string`,
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const data = await response.json();
      saveToken(data.access_token); // ✅ Correct: use in event handler
      console.log("Login successful, token:", data.token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    removeToken(); // ✅ Correct: use in event handler
    console.log("Logout successful");
  };

  return (
    <button id="login-button" onClick={loginToken ? handleLogout : handleLogin}>{loginToken ? "Logout" : "Login"}</button>
  );
}