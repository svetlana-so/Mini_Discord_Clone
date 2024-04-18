import { useEffect, useRef } from "react";

/* eslint-disable react/prop-types */
export default function Chat({ messages }) {
  //here I had to use useRef hook to prevent unnecessary rerenders
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {messages.map((message, index) => (
          <div key={index} className="m-4 text-lg">
            <div className="msg-information flex flex-row gap-4 justify-start items-baseline">
              <div className="text-yellow-400">{message.author}</div>
              <div className="text-gray-500 text-xs">{message.time}</div>
            </div>
            <div className="text-gray-50 text-base whitespace-pre-wrap break-all">
              {message.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
