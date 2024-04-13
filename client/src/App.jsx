import { useState, useEffect } from "react";
import { socket } from "./lib/socket";
import UserBar from "./components/UserBar";
import Channels from "./components/Channels";
import Messages from "./components/Messages";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import Chat from "./components/Chat";

function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [channels, setChannels] = useState([]);
  const [chosenChannel, setChosenChannel] = useState("welcome");
  const [message, setMessage] = useState("");
  const [channelMessages, setChannelMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});

  useEffect(() => {
    socket.on("session", (sessionData) => {
      setSession(sessionData);
    });
    socket.on("users", (userData) => {
      setUsers(userData);
    });

    socket.on("user:join", (userData) => {
      setUsers((prevUsers) => [...prevUsers, userData]);
    });

    socket.on("channels", (channelsData) => {
      setChannels(channelsData);
      const initialMessages = {};
      channelsData.forEach((channel) => {
        initialMessages[channel.name] = [];
      });

      setChannelMessages(initialMessages);
      const initialNewMessages = {};
      channelsData.forEach((channel) => {
        initialNewMessages[channel.name] = false;
      });
      setNewMessages(initialNewMessages);
    });

    socket.on("user:leave", (userData) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userData.userId)
      );
    });

    return () => {
      socket.off("session");
      socket.off("channels");
      socket.off("users");
      socket.off("user:join");
      socket.off("user:leave");
    };
  }, [session]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      socket.auth = { username };
      socket.connect();
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    socket.emit("logout");
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleChannelClick = (channelName) => {
    setChosenChannel(channelName);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendTheMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      const messageData = {
        session,
        author: username,
        message,
        chosenChannel,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      setChannelMessages((prevState) => ({
        ...prevState,
        [chosenChannel]: [...prevState[chosenChannel], messageData],
      }));
      socket.emit("message:channel:send", chosenChannel, messageData);
    }

    setMessage("");
  };

  useEffect(() => {
    socket.on("message:channel", (messageData) => {
      if (messageData.author !== username) {
        setChannelMessages((prevState) => ({
          ...prevState,
          [messageData.chosenChannel]: [
            ...(prevState[messageData.chosenChannel] || []),
            messageData,
          ],
        }));
        setNewMessages((prevState) => ({
          ...prevState,
          [messageData.chosenChannel]: true,
        }));
      }
    });

    return () => {
      socket.off("message:channel");
    };
  }, [channelMessages, username]);

  return (
    <div className="w-full h-screen bg">
      {!isLoggedIn ? (
        <form
          onSubmit={handleLogin}
          className="h-full flex justify-center items-center login"
        >
          <input
            className="text-gray-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="text-gray-200 font-semibold mx-8 login-btn px-4 py-2 rounded-lg"
            type="submit"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-col  items-center justify-between p-4 gap-2 w-20 side-bar">
            <Avatar size="md" className="">
              {
                <AvatarImage
                  src="./src/assests/discord-white-icon.png"
                  alt="discord icon"
                />
              }
            </Avatar>
            <button
              className="p-2 rounded-md logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className=" w-48 channels">
            <Channels
              channels={channels}
              onChannelClick={handleChannelClick}
              newMessages={newMessages}
              setNewMessages={setNewMessages}
              chosenChannel={chosenChannel}
              setChosenChannel={setChosenChannel}
            />
          </div>
          <div className="flex-1 messages flex flex-col justify-end">
            <Chat messages={channelMessages[chosenChannel]} />
            <Messages
              handleSubmit={sendTheMessage}
              message={message}
              handleMessageChange={handleMessageChange}
            />
          </div>
          <div className=" w-48 user-bar">
            <UserBar users={users} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
