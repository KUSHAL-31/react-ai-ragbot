# react-ragbot

`react-ragbot` is a modern React component library that provides drop‑in **AI chat and voice assistant UIs**.  
It is designed to connect seamlessly with your backend (LLM, RAG pipeline, or custom AI service) and give users an experience similar to ChatGPT or Google Assistant.

---

## ✨ Features
- 📦 **Two ready‑to‑use components**:
  - `<ChatBot />` – a chat window UI with typing indicators, light/dark themes, and smooth animations.
  - `<VoiceBot />` – a bottom‑bar voice assistant UI with recording, “thinking…”, typing transcription, and playback.
- 🎨 **Light & Dark mode support** via a simple `darkMode` prop.
- 🔗 **Backend integration** through a `backendUrl` prop – just point to your API endpoint.
- ⚡ Modern, sleek UI inspired by **Google Assistant and ChatGPT**.
- ♿ Accessibility‑friendly and responsive by default.

---

## 📦 Installation

```bash
npm install react-ragbot
```

or

```bash
yarn add react-ragbot
```

---

## 🚀 Usage

### ChatBot

```jsx
import { ChatBot } from "react-ragbot";

function App() {
  return (
    <ChatBot
      backendUrl="http://localhost:3001/api/bot/chat"
      darkMode={false} // or true
    />
  );
}
```

### VoiceBot

```jsx
import { VoiceBot } from "react-ragbot";

function App() {
  return (
    <VoiceBot
      backendUrl="http://localhost:3001/api/bot/voice"
      darkMode={true} // or false
    />
  );
}
```

---

## 🔧 Props

Both `<ChatBot />` and `<VoiceBot />` accept the following props:

| Prop        | Type    | Required | Description |
|-------------|--------|----------|-------------|
| `backendUrl` | string | ✅ Yes   | Your backend API endpoint. For ChatBot this should accept text messages; for VoiceBot it should accept audio input and return transcription + audio response. |
| `darkMode`   | boolean| ❌ No    | Toggles between light (`false`) and dark (`true`) UI themes. |

---

## ⚙️ How it Works

- **ChatBot**:  
  - Renders a chat UI (like ChatGPT).  
  - Sends user text messages to your `backendUrl`.  
  - Displays AI responses with a typing animation and message bubbles.  

- **VoiceBot**:  
  - Renders a bottom bar with a mic button.  
  - Records user speech via the browser’s `MediaRecorder`.  
  - Sends audio to your `backendUrl`.  
  - Expects a response with `{ success, answer, audio }`, where:  
    - `answer` = transcription / text to show with typing effect  
    - `audio` = base64 encoded audio to play back  
  - Displays animated waves while recording, shimmer while processing, and typed text while playing.  

---

## 📂 Example Backend Response (VoiceBot)

```json
{
  "success": true,
  "answer": "Hello! I can help you with your query.",
  "audio": "<base64-encoded-mp3>"
}
```

---

## 🎯 When to Use

- Add an **AI support assistant** to your SaaS app.  
- Build **RAG (Retrieval-Augmented Generation)** frontends easily.  
- Create a **voice-enabled chatbot** like Google Assistant.  
- Prototype **LLM‑powered agents** quickly with minimal UI work.

---

## 🛠 Development

Clone and run locally:

```bash
git clone https://github.com/your-org/react-ragbot.git
cd react-ragbot
npm install
npm run dev
```

---

## 📜 License

MIT License © 2025

