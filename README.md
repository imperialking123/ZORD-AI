# ZORD AI — Fullstack Chat Assistant

Live demo: https://zordai.netlify.app/

A compact, production-minded fullstack chat assistant built with React (Vite + Chakra UI) on the frontend and Express + Socket.IO + Mongoose on the backend. The app demonstrates OAuth flows, real-time streaming responses from a generative model, resumable chat history, image uploads, and a focused developer-first architecture.

## Quick highlights
- Real-time chat streaming via WebSockets (socket.io) — see [`io`](Backend/src/lib/io.js) and server bootstrap in [`server.js`](Backend/src/server.js).
- OAuth for Google / GitHub / Discord with server-side state token validation — see [`handleGoogleAuth`](Backend/src/controllers/authController.js) and [`handleGithubAuth`](Backend/src/controllers/authController.js).
- Generative AI integration (Google GenAI) with streaming and retry/backoff logic — implemented in [`handleStartMessage`](Backend/src/controllers/messageController.js) and the helper [`doRequestWithRetry`](Backend/src/utils/requestUtils.js).
- Secure JWT cookie auth and route protection — cookie creation in [`generateJWTCookie`](Backend/src/utils/generateToken.js) and route guard in [`protectRoute`](Backend/src/middleware/protectRoute.js).
- Frontend state with Zustand stores and modular UI components built on Chakra UI — entry points: [`userAuthStore`](Frontend/src/store/userAuthStore.js), [`userChatStore`](Frontend/src/store/userChatStore.js), and app shell [`App.jsx`](Frontend/src/App.jsx).
- Consistent UX: markdown renderer, syntax-highlighted code blocks, TTS cleanup and message search — see [`MarkDownRenderer.jsx`](Frontend/src/app/chat-component/ai-message-render/ui/MarkDownRenderer.jsx), [`CodeRender.jsx`](Frontend/src/app/chat-component/ai-message-render/ui/CodeRender.jsx), [`cleanUpMarkdownText`](Frontend/src/utils/chatFunctions.js), and search flow [`searchChatWithText`](Frontend/src/utils/chatFunctions.js).

## Architecture overview
- Frontend: Vite + React + Chakra UI + Zustand
  - App root: [`Frontend/src/main.jsx`](Frontend/src/main.jsx)
  - Routing & shell: [`Frontend/src/App.jsx`](Frontend/src/App.jsx) and [`AppContainer.jsx`](Frontend/src/app/AppContainer.jsx)
  - Auth flows + socket connect: [`connnectSocket`](Frontend/src/utils/authFunction.js) and OAuth pages [`GooglePageContainer.jsx`](Frontend/src/pages/auth-pages/GooglePageContainer.jsx)
- Backend: Express + Socket.IO + Mongoose
  - Server + WebSocket: [`Backend/src/server.js`](Backend/src/server.js) and [`io`](Backend/src/lib/io.js)
  - Auth controllers: [`handleGoogleAuth`](Backend/src/controllers/authController.js), [`handleDiscordAuth`](Backend/src/controllers/authController.js), [`handleGithubAuth`](Backend/src/controllers/authController.js)
  - Chat/message controllers with AI integration: [`Backend/src/controllers/messageController.js`](Backend/src/controllers/messageController.js)
  - DB: Mongoose models for user/chat/message — see [`userSchema.js`](Backend/src/model/userSchema.js), [`chatSchema.js`](Backend/src/model/chatSchema.js), [`messageSchema.js`](Backend/src/model/messageSchema.js)

## Notable engineering decisions / skills showcased
- Secure cookie-based auth (httpOnly cookie; sameSite/secure based on env) — [`generateJWTCookie`](Backend/src/utils/generateToken.js).
- Defensive backend: input validation, ObjectId checks, and streaming retry & exponential backoff — see [`requestUtils.js`](Backend/src/utils/requestUtils.js) and retry usage in [`messageController.js`](Backend/src/controllers/messageController.js).
- Real-time UX: incremental model streaming to clients (low-latency feedback) implemented in [`handleStartMessage`](Backend/src/controllers/messageController.js) and socket handlers in [`io.js`](Backend/src/lib/io.js).
- Frontend ergonomics: accessible components, markdown rendering, code copy, and TTS-friendly cleanup — see [`MarkDownRenderer.jsx`](Frontend/src/app/chat-component/ai-message-render/ui/MarkDownRenderer.jsx), [`CodeRender.jsx`](Frontend/src/app/chat-component/ai-message-render/ui/CodeRender.jsx), and [`cleanUpMarkdownText`](Frontend/src/utils/chatFunctions.js).
- File uploads are converted and stored via ImageKit with server-side handling — see [`ImageKitUploader`](Backend/src/utils/db.js) and upload handling in [`handleSendMessage`](Backend/src/controllers/messageController.js).

## Run locally
1. Frontend
   - cd Frontend
   - npm install
   - copy and set env in `Frontend/.env` (VITE_BACKEND_BASE_URL, VITE_GOOGLE_CLIENT_ID, VITE_GITHUB_CLIENT_ID, VITE_FRONTEND_BASE_URL, etc.)
   - npm run dev
   - frontend entry: [`Frontend/src/main.jsx`](Frontend/src/main.jsx)

2. Backend
   - cd Backend
   - npm install
   - copy and set env in `Backend/.env` (MONGO_URI, JWT_SECRET, FRONTEND_BASE_URL, GEMINI_API_KEY, IMAGE_KIT_* and OAuth secrets)
   - npm run dev
   - backend entry: [`Backend/src/server.js`](Backend/src/server.js)

3. End-to-end
   - Ensure FRONTEND_BASE_URL and CORS origin match
   - Live demo link (deployed): https://zordai.netlify.app/

## Environment variables (core)
- Backend
  - MONGO_URI
  - JWT_SECRET
  - FRONTEND_BASE_URL
  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
  - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
  - DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET
  - GEMINI_API_KEY
  - IMAGE_KIT_PUBLIC_KEY / IMAGE_KIT_PRIVATE_KEY / IMAGE_KIT_URL_ENDPOINT
- Frontend
  - VITE_BACKEND_BASE_URL
  - VITE_GOOGLE_CLIENT_ID
  - VITE_GITHUB_CLIENT_ID
  - VITE_DISCORD_REDIRECT_URL
  - VITE_FRONTEND_BASE_URL

## Where to look first (recommended)
- Startup & sockets: [`Backend/src/lib/io.js`](Backend/src/lib/io.js) and [`Frontend/src/utils/authFunction.js`](Frontend/src/utils/authFunction.js) — connection handshake and socket flow.
- Auth server flow / state token: [`Backend/src/controllers/authController.js`](Backend/src/controllers/authController.js) and [`Frontend/src/components/auth-buttons/GithubAuthButton.jsx`](Frontend/src/components/auth-buttons/GithubAuthButton.jsx).
- Streaming AI responses & persistence: [`Backend/src/controllers/messageController.js`](Backend/src/controllers/messageController.js) and helper retry logic in [`Backend/src/utils/requestUtils.js`](Backend/src/utils/requestUtils.js).
- Frontend messaging UI: [`Frontend/src/app/chat-component/ChatMapContainer.jsx`](Frontend/src/app/chat-component/ChatMapContainer.jsx), [`AiMessageContainer.jsx`](Frontend/src/app/chat-component/ai-message-render/AiMessageContainer.jsx), and [`UserMessageItem.jsx`](Frontend/src/app/chat-component/user-message-render/UserMessageItem.jsx).

## License & contact
- Project files in this repository. Live demo: https://zordai.netlify.app/

---
This README focuses on the engineering details and where to find the important code paths. For follow-up, specify whether to expand docs for deployment, CI, environment examples, or API contract details.