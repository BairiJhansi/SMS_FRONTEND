import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chatbot({ studentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = "http://localhost:5005";

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "assistant",
        text: "Hi 👋 I'm your AI assistant. Ask anything about your courses or assignments!",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message: input,
        studentId
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: res.data?.response || "I don't know.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: "⚠️ Error connecting to AI service",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 999999
      }}
    >
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "26px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: "540px",
            maxWidth: "300vw",
            height: "500px",
            background: "white",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            resize: "both",      /* ⭐ makes resizable */
            overflow: "auto",
            minWidth: "300px",
            minHeight: "350px"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#25D366",
              color: "white",
              padding: "10px 15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>AI Assistant</div>
              <div style={{ fontSize: "12px" }}>Online</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              background: "#f0f2f5"
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px"
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background:
                      msg.sender === "user" ? "#25D366" : "white",
                    color: msg.sender === "user" ? "white" : "black",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ fontSize: "12px", color: "gray" }}>
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "8px",
              display: "flex",
              gap: "8px",
              borderTop: "1px solid #ddd"
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
