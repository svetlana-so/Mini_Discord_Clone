import { useEffect, useRef } from "react";

/* eslint-disable react/prop-types */
export default function Chat({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <div className="overflow-y-auto max-h-screen">
        {messages.map((message, index) => (
          <div key={index} className="m-4 text-2xl">
            <div className="msg-information flex flex-row gap-4 justify-start items-baseline">
              <div className="text-yellow-400">{message.author}</div>
              <div className="text-gray-500 text-xs">{message.time}</div>
            </div>
            <div className="text-gray-100 text-base whitespace-pre-wrap break-all">
              {message.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
