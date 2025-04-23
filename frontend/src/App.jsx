import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import AboutMe from './pages/AboutMe.jsx';
import GameCenter from './pages/GameCenter.jsx';
import PhotoLibrary from './pages/PhotoLibrary.jsx';
import DivCol from './components/DivCol.jsx';
import DivRow from './components/DivRow.jsx';
import TetrisGame from './pages/GameCenter/TetrisGame.jsx';
import './css/Header.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import TicTacToeGame from './pages/GameCenter/TicTacToeGame.jsx';

const links = [
  { to: "/", label: "Landing",element: <Landing /> },
  { to: "/about-me", label: "About Me",element: <AboutMe /> },
  { to: "/game-center", label: "Game Center",element: <GameCenter /> },
  { to: "/photo-library", label: "Photo Library",element: <PhotoLibrary /> },
];
function Header() {
  

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
      </DivRow>
    </header>
  );
}

export default function App() {
  return ( 
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/game-center" element={<GameCenter />} />
        <Route path="/photo-library" element={<PhotoLibrary />} />
        <Route path="/game-center/tetris-game" element={<TetrisGame />} />
        <Route path="/game-center/tic-tac-toe-game" element={<TicTacToeGame/>} />
      </Routes>
    </Router>
  );
}