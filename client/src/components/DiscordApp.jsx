/* eslint-disable react/prop-types */
// First, import the necessary dependencies
import { useState, useEffect } from 'react';
import SideBar from './SideBar';
import Channels from './Channels';
import UserBadge from './UserBadge';
import Chat from './Chat';
import Messages from './Messages';
import UserBar from './UserBar';
import { socket } from '../lib/socket';
import { EVENTS } from '../lib/constants';

export default function DiscordApp({ leaveTheServer, logout, username }) {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [chosenChannel, setChosenChannel] = useState('welcome');
  const [message, setMessage] = useState('');
  const [channelMessages, setChannelMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [showChat, setShowChat] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia('(max-width: 767px)').matches
  );

  // Update the isSmallScreen state whenever the window size changes
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.matchMedia('(max-width: 767px)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle session and events
  useEffect(() => {
    function onSession(sessionData) {
      setSession(sessionData);
      const welcomeMessageData = {
        author: 'Bot',
        message: `${sessionData.username} has joined the server! 🎉 Welcome!`,
        chosenChannel: 'welcome',
        time: new Date().toLocaleTimeString()
      };
      socket.emit(EVENTS.MESSAGE_CHANNEL_SEND, 'welcome', welcomeMessageData);
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
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userData.userId));
    }

    function onUserDisconnect(userData) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userData.userId ? { ...user, connected: false } : user
        )
      );
    }

    socket.on(EVENTS.SESSION, onSession);
    socket.on(EVENTS.USERS, onUsers);
    socket.on(EVENTS.USER_JOIN, onUserJoin);
    socket.on(EVENTS.CHANNELS, onChannels);
    socket.on(EVENTS.USER_LEAVE, onUserLeave);
    socket.on(EVENTS.USER_DISCONNECT, onUserDisconnect);

    return () => {
      socket.off(EVENTS.SESSION, onSession);
      socket.off(EVENTS.USERS, onUsers);
      socket.off(EVENTS.CHANNELS, onChannels);
      socket.off(EVENTS.USER_JOIN, onUserJoin);
      socket.off(EVENTS.USER_LEAVE, onUserLeave);
      socket.off(EVENTS.USER_DISCONNECT, onUserDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on(EVENTS.MESSAGE_CHANNEL, (messageData) => {
      if (messageData.author !== username) {
        setChannelMessages((prevState) => ({
          ...prevState,
          [messageData.chosenChannel]: [
            ...(prevState[messageData.chosenChannel] || []),
            messageData
          ]
        }));
        setNewMessages((prevState) => ({
          ...prevState,
          [messageData.chosenChannel]: true
        }));
      }
    });

    return () => {
      socket.off(EVENTS.MESSAGE_CHANNEL);
    };
  }, [username]);

  const handleChannelClick = (channelName) => {
    if (isSmallScreen) {
      setShowChat(true);
    }
    setChosenChannel(channelName);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendTheMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const messageData = {
        session,
        author: username,
        message,
        chosenChannel,
        time: new Date().toLocaleTimeString(),
        avatar: session.avatar
      };
      setChannelMessages((prevState) => ({
        ...prevState,
        [chosenChannel]: [...prevState[chosenChannel], messageData]
      }));
      socket.emit(EVENTS.MESSAGE_CHANNEL_SEND, chosenChannel, messageData);
    }

    setMessage('');
  };

  const handleBackButtonClick = () => {
    setShowChat(false);
  };

  return (
    <div className="w-full h-full">
      {isSmallScreen ? (
        !showChat ? (
          <div className="flex flex-row w-full h-full">
            <div className="w-1/4">
              <SideBar leaveTheServer={leaveTheServer} logout={logout} />
            </div>
            <div className="w-3/4 channels flex flex-col justify-between">
              <Channels
                channels={channels}
                onChannelClick={handleChannelClick}
                newMessages={newMessages}
                setNewMessages={setNewMessages}
                chosenChannel={chosenChannel}
                setChosenChannel={setChosenChannel}
              />
              <UserBadge username={username} />
            </div>
          </div>
        ) : (
          <div className="messages flex flex-row w-full h-full">
            <div className="flex flex-col w-3/4 justify-between">
              <button
                className="login-btn my-8 mx-4 w-16 rounded-lg z-10"
                onClick={handleBackButtonClick}>
                Back
              </button>
              <div className="flex justify-end flex-col h-96">
                <Chat messages={channelMessages[chosenChannel]} />
                <Messages
                  handleSubmit={sendTheMessage}
                  message={message}
                  handleMessageChange={handleMessageChange}
                  chosenChannel={chosenChannel}
                />
              </div>
            </div>
            <div className="w-1/4 user-bar">
              <UserBar users={users} />
            </div>
          </div>
        )
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
              chosenChannel={chosenChannel}
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
