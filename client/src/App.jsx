import { useState, useEffect } from "react";
import { socket } from "./lib/socket";
import UserBar from "./components/UserBar";
import Channels from "./components/Channels";
import Messages from "./components/Messages";
import Chat from "./components/Chat";
import SideBar from "./components/SideBar";
import UserBadge from "./components/UserBadge";

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
    function onSession(sessionData) {
      setSession(sessionData);
      const welcomeMessageData = {
        author: "Bot",
        message: `${sessionData.username} has joined the server! Welcome!`,
        chosenChannel: "welcome",
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("message:channel:send", "welcome", welcomeMessageData);
    }

    function onUsers(userData) {
      setUsers(userData);
    }

    function onUserJoin(userData) {
      setUsers((prevUsers) => [...prevUsers, userData]);
    }

    function onChannels(channelsData) {
      setChannels(channelsData);

      const initialMessages = {};
      const initialNewMessages = {};

      channelsData.forEach((channel) => {
        initialMessages[channel.name] = [];
        initialNewMessages[channel.name] = false;
      });

      setChannelMessages(initialMessages);
      setNewMessages(initialNewMessages);
    }

    function onUserLeave(userData) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userData.userId)
      );
    }

    function onUserDisconnect(userData) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userData.userId ? { ...user, connected: false } : user
        )
      );
    }

    socket.on("session", onSession);
    socket.on("users", onUsers);
    socket.on("user:join", onUserJoin);
    socket.on("channels", onChannels);
    socket.on("user:leave", onUserLeave);
    socket.on("user:disconnect", onUserDisconnect);

    return () => {
      socket.off("session");
      socket.off("channels");
      socket.off("users");
      socket.off("user:join");
      socket.off("user:leave");
      socket.off("user:disconnect");
    };
  }, [session, users]);
  

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      socket.auth = { username };
      socket.connect();
      setIsLoggedIn(true);
    }
  };

  const leaveTheServer = () => {
    socket.emit("user:leave");
    setIsLoggedIn(false);
    setUsername("");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    socket.disconnect();
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
        time: new Date().toLocaleTimeString(),
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
          <SideBar leaveTheServer={leaveTheServer} logout={logout} />
          <div className=" w-48 channels flex flex-col justify-between">
            <Channels
              channels={channels}
              onChannelClick={handleChannelClick}
              newMessages={newMessages}
              setNewMessages={setNewMessages}
              chosenChannel={chosenChannel}
              setChosenChannel={setChosenChannel}
            />
            <UserBadge username={username}></UserBadge>
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
