import { useState, useRef, useEffect } from "react";
import ChatbotIcon from "./Components/Chatboticon";
import ChatForm from "./Components/Chatform";
import ChatMessage from "./Components/ChatMessage";

// Wrap generateBotResponse with debounce (delay of 1.5s)


const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null); // 🔥 Reference for chat container

  // Function to check if user is at the bottom
  const isUserAtBottom = () => {
    const chatContainer = chatContainerRef.current;
    return chatContainer && chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 10;
  };

  // Auto-scroll when new messages arrive if the user is at the bottom
  useEffect(() => {
    if (isUserAtBottom()) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateBotResponse = async (history, retries = 3, delay = 2000) => {
  const updateHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text },
    ]);
  };

  const formattedHistory = history.map(({ role, text }) => ({
    role: role === "user" ? "user" : "model",
    parts: [{ text }],
  }));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedHistory }),
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      if (response.status === 429) {
        console.warn("Too many requests! Retrying...");
        await new Promise((resolve) => setTimeout(resolve, delay * attempt)); // Exponential backoff
        continue;
      }
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const apiResponseText = data.candidates[0].content.parts[0].text.trim();
      
      updateHistory(apiResponseText);
      return;

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (error.message.includes("quota") || response?.status === 429) {
        updateHistory("API quota exceeded. Please try again later.");
        return;
      }

      if (attempt === retries) {
        updateHistory("Chatbot service is temporarily unavailable.");
      }
    }
  }
};

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div className="chat-body" ref={chatContainerRef}> {/* 🔥 Attach ref here */}
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋🏻 <br /> How can I help you today?
            </p>
          </div>

          {/* Render chat history */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;