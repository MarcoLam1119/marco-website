import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContainerGrid from '../components/ContainerGrid';

export default function GameCenter() {
  const gameList = [
    { name: "Tetris", link: "tetris-game", image: "" },
    { name: "Tic Tac Toe", link: "tic-tac-toe-game", image: "" },
    { name: "Game2", link: "game2", image: "" },
  ];

  return (
    <>
      <h1>Game Center</h1>
      <ContainerGrid>
        {gameList.map((game, index) => (
          <Gamecontainer
            key={index}
            gameName={game.name}
            gameLink={game.link}
            gameImage={game.image}
          />
        ))}
      </ContainerGrid>
      
      
    </>
  );
}

function Gamecontainer({gameName, gameLink, gameImage}) {
  return (
    <Link to={gameLink}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px',border: '1px solid black', padding: '10px', borderRadius: '5px', alignItems: 'center' }}>
          <h2>{gameName}</h2>
          <img src={{gameImage}}/>
        </div>
    </Link>
  );
}


