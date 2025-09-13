import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Bot, User, X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  backendUrl: string;
  darkMode?: boolean;
  title?: string;
  displayMode?: "float" | "popup";
  buttonText?: string;
  className?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({
  backendUrl,
  darkMode = false,
  title = "AI Assistant",
  displayMode = "float",
  buttonText,
  className = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help answer your questions. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const animateTyping = (text: string, callback: () => void) => {
    setIsTyping(true);
    setTypingText("");
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        setTypingText(text.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, 20 + Math.random() * 30);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setTypingText("");
          callback();
        }, 300);
      }
    };

    typeWriter();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/bot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botResponse =
        data.answer || "Sorry, I couldn't process your request.";

      setIsLoading(false);
      animateTyping(botResponse, () => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your request. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm here to help answer your questions. What would you like to know?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsLoading(false);
    setIsTyping(false);
    setTypingText("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Define button colors based on theme
  const buttonColors = darkMode
    ? {
        background: "bg-gradient-to-r from-slate-700 to-slate-600",
        hover: "hover:from-slate-600 hover:to-slate-500",
        shadow: "shadow-slate-900/30",
      }
    : {
        background: "bg-gradient-to-r from-blue-500 to-purple-600",
        hover: "hover:from-blue-600 hover:to-purple-700",
        shadow: "shadow-blue-500/30",
      };

  const ChatWindow = () => (
    <div
      className={`
        ragbot-chat flex flex-col w-96 h-[500px]
        ${
          darkMode
            ? "bg-slate-900/95 border-slate-600/80"
            : "bg-white/95 border-slate-200/80"
        }
        ${
          displayMode === "popup" ? "max-w-2xl w-full max-h-[600px] h-full" : ""
        }
        rounded-2xl border backdrop-blur-md shadow-2xl
        ${
          isOpen
            ? "animate-in slide-in-from-bottom-4 zoom-in-90"
            : "animate-out slide-out-to-bottom-4 zoom-out-90"
        }
        duration-300 ease-out
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between p-4
          ${
            darkMode
              ? "bg-slate-800/90 border-slate-600/80"
              : "bg-white/90 border-slate-200/80"
          }
          border-b rounded-t-2xl
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 p-1 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
            <MessageCircle size={18} />
          </div>
          <span
            className={`font-semibold text-base ${
              darkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
            {title}
          </span>
        </div>
        <button
          onClick={() => {
            resetChat();
            setIsOpen(false);
          }}
          className={`
            p-2 rounded-lg transition-colors
            ${
              darkMode
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            }
          `}
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
              message.isBot ? "" : "flex-row-reverse"
            }`}
          >
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white
                ${
                  message.isBot
                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                    : "bg-gradient-to-br from-green-500 to-cyan-500"
                }
              `}
            >
              {message.isBot ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="flex-1 max-w-[calc(100%-40px)]">
              <div
                className={`
                  px-4 py-3 rounded-xl text-sm leading-relaxed break-words
                  ${
                    message.isBot
                      ? `${message.isBot ? "rounded-tl-sm" : ""} ${
                          darkMode
                            ? "bg-slate-800/80 text-slate-200 border border-slate-600/60"
                            : "bg-slate-50/80 text-slate-700 border border-slate-200/60"
                        }`
                      : `${
                          !message.isBot ? "rounded-tr-sm" : ""
                        } bg-gradient-to-r from-blue-500 to-purple-600 text-white`
                  }
                `}
              >
                {message.text}
              </div>
              <div
                className={`text-xs mt-1.5 opacity-60 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div
              className={`
                px-4 py-3 rounded-xl rounded-tl-sm
                ${
                  darkMode
                    ? "bg-slate-800/80 border border-slate-600/60"
                    : "bg-slate-50/80 border border-slate-200/60"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? "bg-blue-400" : "bg-blue-500"
                      }`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div
              className={`
                px-4 py-3 rounded-xl rounded-tl-sm text-sm
                ${
                  darkMode
                    ? "bg-slate-800/80 text-slate-200 border border-slate-600/60"
                    : "bg-slate-50/80 text-slate-700 border border-slate-200/60"
                }
              `}
            >
              {typingText}
              <span className="inline-block w-0.5 h-4 ml-0.5 bg-blue-500 animate-pulse" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`
          p-4 border-t
          ${
            darkMode
              ? "bg-slate-800/90 border-slate-600/80"
              : "bg-white/90 border-slate-200/80"
          }
          rounded-b-2xl
        `}
      >
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading || isTyping}
            className={`
              flex-1 resize-none rounded-xl px-4 py-3 text-sm transition-all
              max-h-20 min-h-[44px] border
              ${
                darkMode
                  ? "bg-slate-700/80 border-slate-600/80 text-slate-100 placeholder-slate-400"
                  : "bg-white/80 border-slate-200/80 text-slate-700 placeholder-slate-400"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || isTyping}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center transition-all
              ${
                !inputValue.trim() || isLoading || isTyping
                  ? `${
                      darkMode
                        ? "bg-slate-700 text-slate-500"
                        : "bg-slate-200 text-slate-400"
                    } cursor-not-allowed`
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
              }
            `}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Popup display mode
  if (displayMode === "popup") {
    if (!isOpen) {
      // Default floating button for popup
      return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <div className="relative">
            <button
              onClick={toggleChatbot}
              className={`
                w-16 h-16 rounded-full text-white transition-all duration-300 
                hover:scale-110 hover:shadow-2xl active:scale-95 
                flex items-center justify-center
                ${buttonColors.background} shadow-lg ${buttonColors.shadow}
              `}
            >
              <MessageCircle size={28} />
            </button>

            {/* Button Text for floating button */}
            {buttonText && (
              <div
                className={`
                  absolute right-20 top-1/2 transform -translate-y-1/2
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  ${
                    darkMode
                      ? "bg-slate-800 text-slate-200 border border-slate-600"
                      : "bg-white text-slate-700 border border-slate-200"
                  }
                  shadow-lg animate-in slide-in-from-right-2 duration-300
                  after:content-[''] after:absolute after:left-full after:top-1/2 
                  after:transform after:-translate-y-1/2 after:border-4 after:border-transparent
                  ${
                    darkMode
                      ? "after:border-l-slate-800"
                      : "after:border-l-white"
                  }
                `}
              >
                {buttonText}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Show popup overlay
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          <ChatWindow />
        </div>
      </div>
    );
  }

  // Float display mode (default)
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 z-10">
          <ChatWindow />
        </div>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          onClick={toggleChatbot}
          className={`
              w-16 h-16 rounded-full text-white transition-all duration-300 
              hover:scale-110 hover:shadow-2xl active:scale-95 
              flex items-center justify-center
              ${buttonColors.background} shadow-lg ${buttonColors.shadow}
            `}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>

        {/* Button Text for floating button */}
        {buttonText && !isOpen && (
          <div
            className={`
                absolute right-20 top-1/2 transform -translate-y-1/2
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                ${
                  darkMode
                    ? "bg-slate-800 text-slate-200 border border-slate-600"
                    : "bg-white text-slate-700 border border-slate-200"
                }
                shadow-lg animate-in slide-in-from-right-2 duration-300
                after:content-[''] after:absolute after:left-full after:top-1/2 
                after:transform after:-translate-y-1/2 after:border-4 after:border-transparent
                ${
                  darkMode ? "after:border-l-slate-800" : "after:border-l-white"
                }
              `}
          >
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
