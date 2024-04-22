import { useState } from 'react';
import { socket } from './lib/socket';
import Login from './components/Login';
import DiscordApp from './components/DiscordApp';
import { EVENTS } from './lib/constants';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      socket.auth = { username };
      socket.connect();
      setIsLoggedIn(true);
    }
  };

  const leaveTheServer = () => {
    socket.emit(EVENTS.USER_LEAVE);
    setIsLoggedIn(false);
    setUsername('');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    socket.disconnect();
  };

  return (
    <div className="w-full h-screen bg">
      {!isLoggedIn ? (
        <Login handleLogin={handleLogin} username={username} setUsername={setUsername} />
      ) : (
        <DiscordApp leaveTheServer={leaveTheServer} logout={logout} username={username} />
      )}
    </div>
  );
}

export default App;
