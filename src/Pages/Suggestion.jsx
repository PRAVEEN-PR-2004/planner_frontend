import React, { useState, useEffect, useRef } from "react";

const Suggestion = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const newChat = { type: "user", text: message };
    setChatHistory((prev) => [...prev, newChat]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botReply = {
        type: "bot",
        text: res.ok ? data.reply : data.error || "Something went wrong!",
      };

      setChatHistory((prev) => [...prev, botReply]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Failed to connect to the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full py-3 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Academic Assistant
          </h1>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </header>

      {/* Chat Section */}
      <main className="flex flex-col flex-1 w-full max-w-5xl px-4 pt-6 pb-32 mx-auto overflow-hidden">
        <div
          ref={chatContainerRef}
          className="flex-1 w-full space-y-4 overflow-x-hidden overflow-y-auto"
        >
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-6 mb-4 rounded-full bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                How can I help you today?
              </h2>
              <p className="max-w-md text-gray-500">
                Ask me anything about your academic work, from research help to
                writing suggestions.
              </p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative px-5 py-3 max-w-[85%] lg:max-w-[75%] text-sm rounded-2xl shadow-sm whitespace-pre-wrap ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  }`}
                >
                  {msg.text}
                  {msg.type === "user" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 -mr-1 transform rotate-45 translate-x-1/2 translate-y-1/2 bg-blue-600"></span>
                  )}
                  {msg.type === "bot" && (
                    <span className="absolute bottom-0 left-0 w-3 h-3 -ml-1 transform rotate-45 -translate-x-1/2 translate-y-1/2 bg-white border-t border-l border-gray-100"></span>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-5 py-3 text-sm bg-white border border-gray-100 rounded-bl-none shadow-sm rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-100 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-200 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-sm">
        <div className="container max-w-5xl px-4 py-3 mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full px-5 py-3 pr-12 text-sm rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                  isLoading || !message.trim()
                    ? "text-gray-400"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-center text-gray-400">
            Academic Assistant may produce inaccurate information about people,
            places, or facts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Suggestion;
