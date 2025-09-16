import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, X } from "lucide-react";

interface VoiceBotProps {
  darkMode?: boolean;
  backendUrl: string;
  text?: string;
}

const VoiceBot: React.FC<VoiceBotProps> = ({
  darkMode = false,
  backendUrl,
  text,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [typedText, setTypedText] = useState("Tap to speak");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const typingInterval = useRef<number | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support audio recording");
    }
  }, []);

  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTo({
        top: textContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [typedText]);

  const resetAllStates = () => {
    if (mediaRecorder.current && isRecording) mediaRecorder.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    stopTypingAnimation();
    setIsRecording(false);
    setIsProcessing(false);
    setIsPlaying(false);
    setError("");
    setTypedText("Tap to speak");
    audioChunks.current = [];
    mediaRecorder.current = null;
  };

  const startRecording = async () => {
    try {
      setError("");
      setTypedText("Listening...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });
          processVoiceInput(audioBlob);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      setError(`Failed to access microphone: ${(err as Error).message}`);
      resetAllStates();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setTypedText("Processing...");
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const response = await fetch(`${backendUrl}/voice`, {
        method: "POST",
        headers: { "Content-Type": "audio/webm" },
        body: arrayBuffer,
      });

      if (!response.ok) throw new Error("Server error");

      const { transcription, answer, audio } = await response.json();

      if (answer) startTypingAnimation(answer);

      if (audio && audioRef.current) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
          {
            type: "audio/mpeg",
          }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.onloadeddata = () => {
          setIsProcessing(false);
          setIsPlaying(true);
          audioRef.current?.play();
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          setError("Failed to play audio response");
        };
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      setError(`Failed to process audio: ${(err as Error).message}`);
      setIsProcessing(false);
      setTypedText("Tap to speak");
    }
  };

  const startTypingAnimation = (text: string) => {
    stopTypingAnimation();
    if (!text || text.length === 0) {
      setTypedText("Tap to speak");
      return;
    }
    setTypedText("");
    let index = 0;
    const typeNextChar = () => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1));
        index++;
        typingInterval.current = window.setTimeout(typeNextChar, 50);
      }
    };
    typeNextChar();
  };

  const stopTypingAnimation = () => {
    if (typingInterval.current) {
      window.clearTimeout(typingInterval.current);
      typingInterval.current = null;
    }
  };

  const handleButtonClick = () => {
    if (!isPopupOpen) {
      setError("");
      setIsPopupOpen(true);
      return;
    }
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !isPlaying) {
      startRecording();
    }
  };

  const closePopup = () => {
    if (isPlaying) return;
    resetAllStates();
    setIsPopupOpen(false);
  };

  const renderWaves = () => {
    return (
      <div className="flex items-center justify-center space-x-1 flex-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              darkMode ? "bg-blue-400" : "bg-blue-500"
            }`}
            style={{
              height: "12px",
              animation: `waveAnimation 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderPopupContent = () => (
    <div
      className={`ragbot-voice w-full max-w-lg mx-auto rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
        darkMode
          ? "bg-gray-900/95 border-gray-700/50 text-white"
          : "bg-white/95 border-gray-200/50 text-gray-900"
      } shadow-2xl`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200/20">
        <h3 className="text-lg font-semibold">Voice Assistant</h3>
        <button
          onClick={closePopup}
          disabled={isPlaying}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isPlaying
              ? "opacity-50 cursor-not-allowed"
              : darkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
              isRecording
                ? "bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 animate-pulse"
                : isProcessing || isPlaying
                ? "bg-blue-500 border-blue-500 cursor-not-allowed"
                : "bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:scale-105"
            }`}
            onClick={handleButtonClick}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : isPlaying ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : isRecording ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isRecording ? (
              renderWaves()
            ) : (
              <div className="text-base font-medium">
                {isProcessing || isPlaying
                  ? "Answering your question..."
                  : "Ready to listen"}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Height Text Response Area */}
        <div
          className={`h-32 overflow-y-scroll p-4 rounded-lg border text-sm leading-relaxed ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-gray-50/50 border-gray-200/50"
          } scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: darkMode
              ? "#6B7280 transparent"
              : "#9CA3AF transparent",
          }}
        >
          <div ref={textContainerRef} className="whitespace-pre-wrap">
            {typedText}
          </div>
        </div>
      </div>

      {error && (
        <div
          className={`mx-6 mb-6 p-3 rounded-lg border text-sm ${
            darkMode
              ? "bg-red-900/20 border-red-800/50 text-red-400"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3">
          {text && (
            <div
              className={`px-4 py-2 rounded-full backdrop-blur-lg border shadow-lg transition-all duration-200 ${
                darkMode
                  ? "bg-gray-900/90 border-gray-700/50 text-white"
                  : "bg-white/90 border-gray-200/50 text-gray-900"
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">
                {text}
              </span>
            </div>
          )}

          <button
            className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            } hover:scale-105`}
            onClick={handleButtonClick}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <style>
            {`
                    @keyframes waveAnimation {
                      0%, 100% {
                        height: 8px;
                        opacity: 0.6;
                      }
                      50% {
                        height: 24px;
                        opacity: 1;
                      }
                    }
                  `}
          </style>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
          />
          <div className="relative z-10 w-full max-w-lg">
            {renderPopupContent()}
          </div>
        </div>
      )}
      <audio ref={audioRef} style={{ display: "none" }} />
    </>
  );
};

export default VoiceBot;
