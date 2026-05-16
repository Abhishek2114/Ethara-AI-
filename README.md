# 🚀 ETHARA AI — THE ULTIMATE AI WORKSPACE PLATFORM

> **One platform. Multiple AI brains. Real-time collaboration. Production-ready architecture.**
>
> Welcome to **Ethara AI** — a next-generation AI workspace that combines the intelligence of multiple LLMs into a single powerful ecosystem designed for productivity, automation, collaboration, and scale.

---

# 🌐 LIVE DEMO

🔥 **Experience Ethara AI Live Here:**  
👉 https://astralhq.vercel.app/

---

# 🌟 WHY ETHARA AI?

Most AI apps stop at being “just another chatbot.”

**Ethara AI is different.**

This platform is engineered to become an **AI Operating System** for teams, creators, developers, analysts, and businesses — combining:

- 🧠 Multi-LLM Intelligence
- ⚡ Real-Time Collaboration
- 🔐 Enterprise-Level Authentication
- 📂 Team Workspaces
- 🤖 AI Automation
- 🌐 Modern Full-Stack Architecture
- 🚀 Scalable Cloud Deployment

---

# 🔥 FEATURE EXTRAVAGANZA

## 🧠 Multi-AI Integration
Connect and interact with multiple LLM providers from one unified platform.

### Supported / Planned Models
- OpenAI GPT
- Claude
- Gemini
- Perplexity
- Custom AI APIs

---

## 💬 Smart AI Conversations
- Persistent chat history
- Context-aware responses
- Markdown rendering
- Streaming responses
- Multi-session chat management

---

## 👥 Team Collaboration
Work together in real time.

### Includes:
- Shared workspaces
- Team chat
- Project collaboration
- AI-assisted brainstorming
- Shared prompts & templates

---

## ⚡ Real-Time Sync
Powered by WebSockets for lightning-fast updates.

### Real-time Features:
- Live messaging
- Instant updates
- Presence indicators
- Typing indicators
- Team activity sync

---

## 🔐 Secure Authentication
Built with production-grade authentication systems.

### Security Stack:
- JWT Authentication
- OAuth Support
- Secure Sessions
- Protected APIs
- Rate Limiting
- Environment Variable Protection

---

## 📊 AI Productivity Dashboard
Monitor everything from one central command center.

### Dashboard Includes:
- Chat analytics
- Usage tracking
- Team insights
- Workspace management
- AI request monitoring

---

# 🏗️ SYSTEM ARCHITECTURE

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │   React + Vite      │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │    API Gateway      │
                    │   Express Server    │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌────────────────┐    ┌────────────────┐
│ Authentication│    │ AI Integrations│    │ Real-Time Sync │
│ JWT + OAuth   │    │ OpenAI/Claude │    │  Socket.IO     │
└──────────────┘    └────────────────┘    └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │      Database       │
                    │ PostgreSQL/MongoDB  │
                    └─────────────────────┘
```

---

# 🛠️ TECH STACK

## 🎨 Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- Zustand / Context API
- Axios
- React Router

---

## ⚙️ Backend
- Node.js
- Express.js
- TypeScript
- Socket.IO
- JWT Authentication
- REST APIs

---

## 🗄️ Database
Choose your preferred database setup:

### Option 1 — PostgreSQL
- NeonDB
- Railway PostgreSQL
- Supabase

### Option 2 — MongoDB
- MongoDB Atlas
- Local MongoDB

---

## ☁️ Deployment
- Railway
- Vercel
- Render
- Docker
- Netlify

---

# 📂 PROJECT STRUCTURE

```bash
ethara-ai/
│
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # App Pages
│   │   ├── hooks/          # Custom Hooks
│   │   ├── services/       # API Calls
│   │   ├── store/          # Global State
│   │   └── utils/          # Utility Functions
│
├── server/                 # Backend Application
│   ├── routes/             # API Routes
│   ├── controllers/        # Business Logic
│   ├── middleware/         # Middleware
│   ├── models/             # Database Models
│   ├── services/           # External Services
│   └── sockets/            # Real-Time Events
│
├── shared/                 # Shared Types & Configs
│
├── docs/                   # Documentation
│
├── .env.example            # Environment Variables
├── package.json
└── README.md
```

---

# ⚡ QUICK START

## 📦 Clone the Repository

```bash
git clone https://github.com/your-username/ethara-ai.git
cd ethara-ai
```

---

## 📥 Install Dependencies

```bash
npm install
```

---

# 🔑 ENVIRONMENT VARIABLES

Create a `.env` file in the root directory.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_database_url

# JWT
JWT_SECRET=super_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Claude
CLAUDE_API_KEY=your_claude_key

# Gemini
GEMINI_API_KEY=your_gemini_key
```

---

# 🚀 RUN THE PROJECT

## Development Mode

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

# 🌐 DEPLOYMENT GUIDE

# 🚂 Railway Deployment

## 1️⃣ Create Railway Project
- Login to Railway
- Create New Project
- Connect GitHub Repository

---

## 2️⃣ Add Environment Variables

Go to:

```text
Project → Variables
```

Add all `.env` variables.

---

## 3️⃣ Deploy Backend

Railway automatically detects:
- Node.js
- Build Commands
- Start Commands

---

## 4️⃣ Database Setup

### PostgreSQL
```text
Railway → Add Plugin → PostgreSQL
```

Copy the generated DATABASE_URL.

---

# ▲ Vercel Deployment

## Deploy Frontend

```bash
npm install -g vercel
vercel
```

---

## Configure Environment Variables

Inside Vercel Dashboard:
- Add API URL
- Add public environment variables

---

## Connect Backend

Update frontend API base URL:

```env
VITE_API_URL=https://your-backend-url.com
```

---

# 🧠 AI PROVIDER INTEGRATION

## OpenAI Example

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

## Claude Example

```ts
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});
```

---

# 📡 API REFERENCE

# 🔑 Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/me` | Get Current User |

---

# 💬 Chat APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chats` | Get Chats |
| POST | `/api/chats` | Create Chat |
| POST | `/api/messages` | Send Message |

---

# 👥 Workspace APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspaces` | Get Workspaces |
| POST | `/api/workspaces` | Create Workspace |
| PUT | `/api/workspaces/:id` | Update Workspace |

---

# 🔥 REAL-TIME EVENTS

## Socket Events

```text
connect
disconnect
message:new
workspace:update
user:typing
presence:update
```

---

# 🔐 SECURITY FEATURES

✅ JWT Authentication  
✅ Password Hashing  
✅ Environment Variable Protection  
✅ API Validation  
✅ Rate Limiting  
✅ CORS Protection  
✅ Secure Headers  
✅ Input Sanitization  

---

# 🧪 TESTING

## Run Tests

```bash
npm run test
```

---

## Run Linting

```bash
npm run lint
```

---

# 🐳 DOCKER SUPPORT

## Build Docker Image

```bash
docker build -t ethara-ai .
```

---

## Run Container

```bash
docker run -p 5000:5000 ethara-ai
```

---

# 🐛 TROUBLESHOOTING

# ❌ Environment Variables Not Working

### Fix:
- Restart server
- Check `.env` spelling
- Ensure variables are loaded correctly

---

# ❌ Database Connection Failed

### Fix:
- Verify DATABASE_URL
- Check DB permissions
- Ensure database is active

---

# ❌ CORS Errors

### Fix:
Update backend CORS config:

```ts
origin: ["http://localhost:5173"]
```

---

# ❌ Build Failed on Railway

### Fix:
Ensure:

```json
"build": "npm run build"
```

exists in `package.json`.

---

# 📈 FUTURE ROADMAP

## 🚀 Upcoming Features

- AI Agents
- Voice AI
- AI File Analysis
- Team Roles & Permissions
- AI Workflow Automation
- RAG Pipeline
- AI Search Engine
- Plugin Marketplace
- Mobile App
- AI Coding Assistant

---

# 🤝 CONTRIBUTING

We welcome contributors from around the world.

## Steps to Contribute

1. Fork the Repository
2. Create a Feature Branch
3. Commit Changes
4. Push to GitHub
5. Open Pull Request

---

# 💡 LEARNING RESOURCES

## Recommended Docs
- React Documentation
- Node.js Documentation
- TypeScript Handbook
- Socket.IO Docs
- Railway Docs
- Vercel Docs

---

# 🌍 OPEN SOURCE VISION

Ethara AI is more than a project.

It’s a movement toward:
- Smarter collaboration
- AI-powered productivity
- Unified intelligence systems
- Accessible AI infrastructure

---

# 👨‍💻 BUILT FOR BUILDERS

Whether you're:
- a developer,
- startup founder,
- AI engineer,
- student,
- researcher,
- or innovator...

**Ethara AI is built to help you create faster, smarter, and bigger.**

---

# ⭐ SUPPORT THE PROJECT

If this project helped you:

🌟 Star the repository  
🍴 Fork the project  
🧠 Contribute ideas  
🚀 Share with developers  

---

# 📜 LICENSE

MIT License © 2026 Ethara AI

---

# 🚀 FINAL MESSAGE

> **This isn’t just another AI app.**
>
> Ethara AI is the foundation for the next generation of intelligent collaboration systems.
>
> Build boldly. Scale fearlessly. Ship faster. 💥
