# react-ai-ragbot

`react-ai-ragbot` is a modern React + TypeScript component library that provides drop‑in **AI chat and voice assistant UIs**.  
It is designed to connect seamlessly with your backend (LLM, RAG pipeline, or custom AI service) and give users an experience similar to ChatGPT or Google Assistant.

---

## ✨ Features
- 📦 **Two ready‑to‑use components**:
  - `<ChatBot />` – a customizable chat window UI with typing indicators, themes, popup/float display modes, and smooth animations.
  - `<VoiceBot />` – a voice assistant UI with recording, “thinking…”, typing transcription, and audio playback in a popup modal.
- 🎨 **Light & Dark mode support** via a simple `darkMode` prop.
- 🔗 **Backend integration** through a `backendUrl` prop – just point to your API endpoint.
- ⚡ Sleek, modern UI powered by **TailwindCSS**.
- 🛠 Built with **TypeScript**, but works in both JS and TS projects.
- 🔄 First‑class support for [`node-ragbot`](https://www.npmjs.com/package/node-ragbot) – a backend companion package that provides ready‑to‑use REST APIs for chat and voice.  

---

## 📦 Installation

### Frontend (React)
```bash
npm install react-ai-ragbot
```

or

```bash
yarn add react-ai-ragbot
```

### Backend (Node)
Install the companion backend package:

```bash
npm install node-ragbot
```

This package exposes REST endpoints (`/api/bot/chat` and `/api/bot/voice`) that are fully compatible with the React components.  

---

## 🚀 Usage

### ChatBot

```tsx
import { ChatBot } from "react-ai-ragbot";

function App() {
  return (
    <ChatBot
      backendUrl="http://localhost:5000" // your backend base URL
      darkMode={false}                   // optional: light (false) or dark (true)
      title="AI Support"                 // optional: header title
      displayMode="float"                // "float" (default) or "popup"
      buttonText="Need help?"            // optional: label beside floating button
      className="custom-class"           // optional: extra classes
    />
  );
}
```

### VoiceBot

```tsx
import { VoiceBot } from "react-ai-ragbot";

function App() {
  return (
    <VoiceBot
      backendUrl="http://localhost:5000" // your backend base URL
      darkMode={true}                    // optional: light (false) or dark (true)
      text="Talk to me"                  // optional: label beside mic button
    />
  );
}
```

---

## 🔧 Props

### ChatBot Props

| Prop         | Type                              | Required | Default        | Description |
|--------------|-----------------------------------|----------|----------------|-------------|
| `backendUrl` | `string`                          | ✅ Yes   | —              | Your backend base URL. Chat requests will POST to `${backendUrl}/api/bot/chat`. |
| `darkMode`   | `boolean`                         | ❌ No    | `false`        | Toggle light/dark theme. |
| `title`      | `string`                          | ❌ No    | `"AI Assistant"` | Header title of the chat window. |
| `displayMode`| `"float"` or `"popup"`            | ❌ No    | `"float"`      | Floating widget or fullscreen popup. |
| `buttonText` | `string`                          | ❌ No    | —              | Optional label displayed beside the trigger button. |
| `className`  | `string`                          | ❌ No    | `""`           | Extra CSS classes for wrapper positioning. |

---

### VoiceBot Props

| Prop         | Type      | Required | Default       | Description |
|--------------|-----------|----------|---------------|-------------|
| `backendUrl` | `string`  | ✅ Yes   | —             | Your backend base URL. Voice requests will POST to `${backendUrl}/api/bot/voice`. |
| `darkMode`   | `boolean` | ❌ No    | `false`       | Toggle light/dark theme. |
| `text`       | `string`  | ❌ No    | `"Tap to speak"` | Optional label shown beside mic button. |

---

## ⚙️ How It Works

- **ChatBot**  
  - Renders a chat UI with floating/popup modes.  
  - Sends user text messages to your backend at `/api/bot/chat`.  
  - Displays AI responses with a typing animation and timestamp.  

- **VoiceBot**  
  - Opens a popup modal with a mic button.  
  - Records speech using browser `MediaRecorder`.  
  - Sends audio to your backend at `/api/bot/voice`.  
  - Expects a JSON response:  

```json
{
  "success": true,
  "answer": "Hello! I can help you with your query.",
  "audio": "<base64-encoded-mp3>"
}
```

  - Plays the returned audio and shows transcription with typing animation.  

---

## 🔗 Backend with node-ragbot

For quickest integration, install the [`node-ragbot`](https://www.npmjs.com/package/node-ragbot) backend package.  

It provides out‑of‑the‑box API endpoints:  

- `POST /api/bot/chat` → expects `{ question: string }` and returns `{ answer: string }`.  
- `POST /api/bot/voice` → expects an audio file and returns `{ success, answer, audio }`.  

You can extend it with your own logic (OpenAI, RAG pipelines, etc.).  
The React components are pre‑configured to call these endpoints, so frontend + backend work seamlessly together.  

---

## 🎯 When to Use

- Add an **AI support assistant** to your SaaS app.  
- Build **RAG (Retrieval-Augmented Generation)** frontends quickly.  
- Create a **voice-enabled chatbot** like Google Assistant.  
- Prototype **LLM‑powered agents** without UI boilerplate.  

---

## 🛠 Development

Clone and run locally:

```bash
git clone https://github.com/your-org/react-ai-ragbot.git
cd react-ai-ragbot
npm install
npm run dev
```

---

## 📜 License

MIT License © 2025
