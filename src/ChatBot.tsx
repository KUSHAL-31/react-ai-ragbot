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

/* ----------------------------- ChatWindow ----------------------------- */
interface ChatWindowProps {
  darkMode: boolean;
  title: string;
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  isTyping: boolean;
  typingText: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  formatTime: (date: Date) => string;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  resetChat: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  darkMode,
  title,
  messages,
  isOpen,
  isLoading,
  isTyping,
  typingText,
  inputValue,
  setInputValue,
  inputRef,
  messagesEndRef,
  formatTime,
  handleSendMessage,
  handleKeyPress,
  resetChat,
}) => {
  return (
    <div
      className={`
        ragbot-chat flex flex-col w-96 h-[500px]
        ${
          darkMode
            ? "bg-slate-900/95 border-slate-600/80"
            : "bg-white/95 border-slate-200/80"
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
          onClick={resetChat}
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
                  px-4 py-3 rounded-xl text-sm leading-relaxed break-words text-left
                  ${
                    message.isBot
                      ? darkMode
                        ? "bg-slate-800/80 text-slate-200 border border-slate-600/60"
                        : "bg-slate-50/80 text-slate-700 border border-slate-200/60"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  }
                `}
              >
                {message.text}
              </div>
              <div
                className={`text-xs mt-1.5 opacity-60 text-left ${
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
                px-4 py-3 rounded-xl rounded-tl-sm text-left text-sm
                ${
                  darkMode
                    ? "bg-slate-800/80 border border-slate-600/60"
                    : "bg-slate-50/80 border border-slate-200/60"
                }
              `}
            >
              Thinking...
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
                px-4 py-3 rounded-xl rounded-tl-sm text-sm text-left leading-relaxed
                ${
                  darkMode
                    ? "bg-slate-800/80 text-slate-200 border border-slate-600/60"
                    : "bg-slate-50/80 text-slate-700 border border-slate-200/60"
                }
              `}
            >
              {typingText}
              <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-blue-500 animate-pulse" />
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
              max-h-20 min-h-[44px] border text-left
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
                  ? darkMode
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
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
};

/* ----------------------------- ChatBot ----------------------------- */
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
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const startTypingAnimation = (text: string) => {
    setIsTyping(true);
    setTypingText("");
    let index = 0;

    const typeNextChar = () => {
      if (index < text.length) {
        setTypingText(text.substring(0, index + 1));
        index++;
        typingIntervalRef.current = setTimeout(typeNextChar, 30); // Typing speed
      } else {
        // Typing animation finished
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: text,
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      }
    };

    typeNextChar();
  };

  const stopTypingAnimation = () => {
    if (typingIntervalRef.current) {
      clearTimeout(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsTyping(false);
    setTypingText("");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isTyping) return;

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
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const botResponse =
        data.answer || "Sorry, I couldn't process your request.";

      setIsLoading(false);
      startTypingAnimation(botResponse);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, there was an error processing your request. Please try again.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    stopTypingAnimation();
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
    setIsOpen(false);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const buttonColors = darkMode
    ? {
        background: "bg-gradient-to-r from-slate-700 to-slate-600",
        shadow: "shadow-slate-900/30",
      }
    : {
        background: "bg-gradient-to-r from-blue-500 to-purple-600",
        shadow: "shadow-blue-500/30",
      };

  /* ----------------------------- UI ----------------------------- */
  if (displayMode === "popup") {
    if (!isOpen) {
      return (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <div className="relative flex items-center gap-3">
            {buttonText && (
              <div
                className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg
                ${
                  darkMode
                    ? "bg-slate-800 text-slate-200 border border-slate-600"
                    : "bg-white text-slate-700 border border-slate-200"
                }
              `}
              >
                {buttonText}
              </div>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center ${buttonColors.background} shadow-lg ${buttonColors.shadow}`}
            >
              <MessageCircle size={28} />
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          <ChatWindow
            darkMode={darkMode}
            title={title}
            messages={messages}
            isOpen={isOpen}
            isLoading={isLoading}
            isTyping={isTyping}
            typingText={typingText}
            inputValue={inputValue}
            setInputValue={setInputValue}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            resetChat={resetChat}
          />
        </div>
      </div>
    );
  }

  // Float mode
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {isOpen && (
        <div className="absolute bottom-20 right-0 z-10">
          <ChatWindow
            darkMode={darkMode}
            title={title}
            messages={messages}
            isOpen={isOpen}
            isLoading={isLoading}
            isTyping={isTyping}
            typingText={typingText}
            inputValue={inputValue}
            setInputValue={setInputValue}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            resetChat={resetChat}
          />
        </div>
      )}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative flex items-center gap-3">
          {buttonText && !isOpen && (
            <div
              className={`
          px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg
          ${
            darkMode
              ? "bg-slate-800 text-slate-200 border border-slate-600"
              : "bg-white text-slate-700 border border-slate-200"
          }
        `}
            >
              {buttonText}
            </div>
          )}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-16 h-16 rounded-full text-white flex items-center justify-center ${buttonColors.background} shadow-lg ${buttonColors.shadow}`}
          >
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
