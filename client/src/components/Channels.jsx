/* eslint-disable react/prop-types */
import { useState } from "react";

export default function Channels({
  channels,
  onChannelClick,
  newMessages,
  setNewMessages,
  chosenChannel,
  setChosenChannel,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (channelName, index) => {
    setSelectedIndex(index);
    setNewMessages((prevState) => ({
      ...prevState,
      [channelName]: false,
    }));

    if (chosenChannel !== channelName) {
      setNewMessages((prevState) => ({
        ...prevState,
        [chosenChannel]: false,
      }));
      onChannelClick(channelName);
      setChosenChannel(channelName);
    }
  };

  return (
    <div className="channels font-semibold text-sm p-4">
      <ul className="my-4 flex flex-col gap-4">
        {channels.map((channel, index) => (
          <li
            key={channel.name}
            className={`${
              selectedIndex === index
                ? "font-semibold text-yellow-300"
                : "font-normal"
            }`}
            onClick={() => handleClick(channel.name, index)}
          >
            #{channel.name.toUpperCase()}
            {newMessages[channel.name] && chosenChannel !== channel.name && (
              <span className="ml-2 inline-block h-3 w-3 rounded-full bg-green-500"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
