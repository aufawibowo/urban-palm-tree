# 🟦 One-Room Real-Time Chat App (Vue + WebSocket + TypeScript)

A simple, real-time chat application built with WebSockets, Vue 3, and TypeScript — designed to mimic the anonymous chat experience of Google Docs.  
All users are assigned a random Indonesian alias (e.g., `Tiger-Jakarta`) and chat in a single shared room.

No accounts. No database. Just fast, real-time messaging.

---

## ✨ Features

- 🧠 Anonymous identity via animal + city alias
- ⚡ Real-time updates using raw WebSockets (`ws`)

---

## 🧱 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | Vue 3 + Vite + TypeScript     |
| Styling      | Vanilla CSS                   |
| Backend      | Node.js + `ws` + TypeScript   |
| Runtime      | PM2 for process management    |
| Hosting      | Local or DigitalOcean Droplet |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourname/chat-room.git
cd chat-room
```

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4. (Optional) Add .env file in client/ for dev
```
VITE_WS_URL=ws://localhost:3000
```