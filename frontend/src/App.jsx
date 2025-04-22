import { useState } from 'react'
import PhotoFrame from './components/PhotoFrame.jsx'

function Row({ children }) {
  return (
    <div className="button-row" style={{ display: 'flex', gap: '10px' }}>
      {children}
    </div>
  )
}

function Column({ children }) {
  return (
    <div className="button-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {children}
    </div>
  )
}

function Header() {
  const [loginState, setLoginState] = useState({
    loggedIn: false,
    user: null,
  });

  const handleLogin = () => {
    setLoginState({ loggedIn: true, user: 'Marco' });
  }

  const handleLogout = () => {
    setLoginState({ loggedIn: false, user: null });
  }

  const handleClick = () => {
    if (loginState.loggedIn) {
      handleLogout();
    } else {
      handleLogin();
    }
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3>Marco Webpage</h3>
      <Row>
        <button>Photo Library</button>
        <button>About</button>
        <button>Contact</button>
        <button onClick={handleClick}>{loginState.loggedIn ? "Logout" : "Login"}</button>
        <div>{loginState.user}</div>
      </Row>
    </header>
  )
}

function Body() {
  return (
    <>
      <h1>Body</h1>
    </>
  )
}

function Footer() {
  return (
    <>
      <h1>Footer</h1>
    </>
  )
}

export default function App() {
  return (
    <>
      <Column>
        <Header />
        <Body />
        <Footer />
      </Column>
    </>
  )
}