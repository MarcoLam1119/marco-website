import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import AboutMe from './pages/AboutMe.jsx';
import GameCenter from './pages/GameCenter.jsx';
import PhotoLibrary from './pages/PhotoLibrary.jsx';

function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3>Marco Webpage</h3>
      <nav>
        <Link to="/">Landing</Link>
        <Link to="/about-me">About Me</Link>
        <Link to="/game-center">Game Center</Link>
        <Link to="/photo-library">Photo Library</Link>
      </nav>
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
      </Routes>
    </Router>
  );
}