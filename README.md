# 🚀 ASTRALHQ — Enterprise AI Workforce Operations Platform

> **Built For Ethara AI**
>
> AstralHQ is a next-generation AI-powered workforce operations platform engineered for modern teams, hybrid organizations, AI-first startups, and enterprise productivity ecosystems.
>
> It combines:
>
> - 🧠 AI Workspace Intelligence
> - 👥 Workforce Management
> - 📊 Productivity Analytics
> - ⏱️ Attendance Tracking
> - ⚡ Real-Time Collaboration
> - 🔐 Enterprise Security
> - 🚀 Production-Grade Architecture

---

# 🌐 LIVE DEPLOYMENT

## 🚀 Experience AstralHQ Live

👉 **Live Website:** etharaai-ten.vercel.app

---

# 🎯 PLATFORM OVERVIEW

AstralHQ transforms traditional workforce management into an intelligent operational command center.

It replaces:
- spreadsheets,
- disconnected dashboards,
- manual attendance systems,
- scattered reporting tools,

with one centralized AI-powered ecosystem.

---

# 🧠 WHAT MAKES ASTRALHQ DIFFERENT?

## Traditional Platforms:
❌ Only attendance  
❌ Only chat  
❌ Only tasks  
❌ No AI intelligence  

---

## AstralHQ:
✅ AI Workforce Intelligence  
✅ Attendance Auditing  
✅ Productivity Scoring  
✅ Team Analytics  
✅ Real-Time Collaboration  
✅ AI Command Center  
✅ Performance Reports  
✅ Multi-role Workspace  

---

# 🔥 FEATURE EXTRAVAGANZA

# 🧠 AI Workspace Intelligence

Integrated AI ecosystem supporting:
- OpenAI
- Claude
- Gemini
- Perplexity
- Custom AI APIs

### Capabilities
- AI-powered productivity
- Team assistance
- Smart workflow recommendations
- Intelligent reporting
- AI operational insights

---

# 👥 Workforce Management System

Complete employee operations infrastructure.

### Includes
- Team dashboards
- Member activity tracking
- Role-based access control
- Workspace management
- Employee performance analytics

---

# ⏱️ Attendance Auditing Engine

Enterprise-grade attendance monitoring system.

### Features
✅ Daily Check-In / Check-Out  
✅ Auto Date Detection  
✅ Live Session Timer  
✅ Work Duration Tracking  
✅ Attendance Heatmaps  
✅ Late Detection  
✅ Leave Management  
✅ Daily Audit Logs  

---

# 📊 AI Productivity Analytics

Track team performance using intelligent scoring systems.

### Weekly Reports
- Tasks completed
- Active work hours
- Attendance percentage
- AI usage analytics
- Productivity ranking

---

### Monthly Reports
- Attendance analysis
- Work quality scoring
- Time spent on platform
- Team contribution analysis
- Performance consistency

---

# 🏆 AI Performance Scoring Engine

AstralHQ calculates intelligent productivity scores using:
- Attendance
- Work consistency
- Task completion
- Active hours
- Team engagement

### Example Logic

```js
score =
(attendance * 0.3) +
(taskCompletion * 0.4) +
(activeHours * 0.2) +
(teamInteraction * 0.1)
```

---

# ⚡ REAL-TIME COLLABORATION

Powered by WebSockets for instant synchronization.

### Real-Time Features
- Live team updates
- Instant messaging
- Typing indicators
- Workspace synchronization
- Live status monitoring

---

# 🏗️ SYSTEM ARCHITECTURE

```text
                     ┌────────────────────────┐
                     │   AstralHQ React UI    │
                     │  (Vite + Tailwind v4)  │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   Express API Server   │
                     │    (Node.js Core)      │
                     └───────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
 ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
 │ JWT Auth &    │       │ Attendance    │       │ Real-Time     │
 │ RBAC Guard    │       │ Audit Engine  │       │ Websockets    │
 └───────────────┘       └───────────────┘       └───────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                     ┌────────────────────────┐
                     │   Prisma ORM Client    │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │ PostgreSQL / SQLite DB │
                     └────────────────────────┘
```

---

# 🎨 UI/UX SYSTEM

AstralHQ follows a:
- Dark luxury UI
- Glassmorphism aesthetics
- Enterprise SaaS architecture
- High-density operational dashboards

---

# 🎯 UI/UX IMPROVEMENTS PLANNED

## Modern SaaS Features
✅ Glassmorphism  
✅ Animated Charts  
✅ AI Dashboards  
✅ Gradient Themes  
✅ Dark Mode  
✅ Real-Time Analytics  
✅ Smart Widgets  

---

# 🛠️ TECH STACK

# 🎨 Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS v4
- Axios
- Zustand
- Lucide Icons
- React Router

---

# ⚙️ Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- REST APIs

---

# 🗄️ Database
- PostgreSQL
- SQLite
- Prisma ORM

---

# 📊 Analytics & Charts
- Recharts
- Chart.js
- Tremor UI

---

# ☁️ Deployment
- Vercel
- Railway
- Render
- Docker

---

# 📂 PROJECT STRUCTURE

```bash
astralhq/
│
├── apps/
│   │
│   ├── client/                 # Frontend Application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── utils/
│   │
│   ├── server/                 # Backend Application
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── prisma/
│       ├── sockets/
│       └── services/
│
├── shared/
├── docs/
├── package.json
└── README.md
```

---

# ⚡ QUICK START

# 📦 Clone Repository

```bash
git clone https://github.com/your-username/astralhq.git
cd astralhq
```

---

# 📥 Install Dependencies

```bash
npm install
```

---

# 🔑 ENVIRONMENT VARIABLES

Create `.env` inside `apps/server/`

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="file:../data/dev.db"

JWT_ACCESS_SECRET="your-high-security-jwt-secret-key"
JWT_REFRESH_SECRET="your-high-security-refresh-secret-key"

OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key
```

---

# 🚀 DATABASE SETUP

# Prisma Migration

```bash
npm run db:deploy --workspace=apps/server
```

---

# Seed Database

```bash
npm run db:seed --workspace=apps/server
```

---

# 🚀 RUN DEVELOPMENT SERVERS

# Backend

```bash
npm run dev:server
```

---

# Frontend

```bash
npm run dev:client
```

---

# 🌐 OPEN APPLICATION

## Local Development
```text
http://localhost:5173/
```

## Production Deployment
👉 https://astralhq.vercel.app/

---

# 🔒 DEFAULT DEMO CREDENTIALS

| Role | Username | Password |
|---|---|---|
| Quality Reviewer | abhishek.singh23@ethara.ai | Admin123! |
| Project Lead | piyush.tomar@ethara.ai | Admin123! |
| Tasker / Engineer | tasker1@ethara.ai | Member123! |

---

# 📡 API MODULES

# Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Current User |

---

# Attendance APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attendance/checkin` | Check-In |
| POST | `/api/attendance/checkout` | Check-Out |
| GET | `/api/attendance/report` | Attendance Report |

---

# Productivity APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/weekly` | Weekly Analytics |
| GET | `/api/analytics/monthly` | Monthly Analytics |
| GET | `/api/analytics/top-performers` | Team Ranking |

---

# 🔥 REAL-TIME SOCKET EVENTS

```text
connect
disconnect
attendance:update
message:new
workspace:update
user:typing
presence:update
```

---

# 🔐 SECURITY FEATURES

✅ JWT Authentication  
✅ RBAC Authorization  
✅ Secure Sessions  
✅ Password Hashing  
✅ Rate Limiting  
✅ API Validation  
✅ CORS Protection  
✅ Input Sanitization  
✅ Environment Isolation  

---

# 📊 ADVANCED ANALYTICS SYSTEM

# Weekly Analytics Dashboard

Includes:
- Attendance graphs
- Productivity charts
- Team rankings
- AI usage metrics
- Active hours reports

---

# Monthly Operational Reports

Tracks:
- Work quality
- Attendance consistency
- Platform usage time
- Team engagement
- Operational efficiency

---

# 🎨 BEST UI/UX TOOLS FOR DEVELOPMENT

## Recommended Design Stack

| Purpose | Tool |
|---|---|
| UI/UX Design | Figma |
| AI UI Generation | v0.dev |
| Dashboard Inspiration | Mobbin |
| Full SaaS UI Builder | Lovable.dev |

---

# 🧪 TESTING

# Run Tests

```bash
npm run test
```

---

# Run Linting

```bash
npm run lint
```

---

# 🐳 DOCKER SUPPORT

# Build Docker Image

```bash
docker build -t astralhq .
```

---

# Run Container

```bash
docker run -p 3000:3000 astralhq
```

---

# 🐛 TROUBLESHOOTING

# Environment Variables Not Working

### Fix
- Restart server
- Verify `.env`
- Reload environment variables

---

# Database Connection Failed

### Fix
- Check Prisma schema
- Verify database path
- Re-run migrations

---

# Socket Connection Issues

### Fix
- Verify backend URL
- Enable CORS
- Restart websocket server

---

# 📈 FUTURE ROADMAP

## 🚀 Upcoming Features

- AI Agents
- AI Attendance Predictions
- Smart Productivity Insights
- Voice AI Assistant
- AI Task Recommendations
- Mobile Application
- AI File Analysis
- Team Heatmaps
- Enterprise SSO
- Slack Integration

---

# 🤝 CONTRIBUTING

We welcome contributors worldwide.

## Contribution Flow

1. Fork Repository
2. Create Feature Branch
3. Commit Changes
4. Push Code
5. Open Pull Request

---

# 🌍 OPEN SOURCE VISION

AstralHQ is designed to become:
- an AI-powered workforce operating system,
- productivity intelligence platform,
- enterprise collaboration ecosystem,
- and operational command center.

---

# 👨‍💻 BUILT FOR BUILDERS

Perfect for:
- Developers
- AI Engineers
- Startups
- Operations Teams
- Productivity Analysts
- Enterprise Organizations

---

# ⭐ SUPPORT THE PROJECT

If you liked AstralHQ:

⭐ Star the Repository  
🍴 Fork the Project  
🚀 Share with Developers  
🧠 Contribute Features  

---

# 📜 LICENSE

MIT License © 2026 Ethara AI

---

# 🚀 FINAL MESSAGE

> AstralHQ is not just another dashboard.
>
> It’s a next-generation AI workforce intelligence platform built for the future of operations, productivity, and intelligent collaboration.
>
> Build faster. Track smarter. Scale infinitely. 💥

---

### Source Reference
Combined and enhanced from uploaded README content.  [oai_citation:0‡README-3.md](sediment://file_00000000a768720b8e92fe79b84fd19c)
