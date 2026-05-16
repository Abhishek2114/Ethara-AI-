# 🚀 ETHARA AI - The Absolute Beast Mode Project Management Engine

> *Where chaos meets control, where productivity skyrockets, and where your team becomes an unstoppable force.*

---

## 🔥 What is This Madness?

**Ethara AI** isn't just another project management tool. It's a **full-stack battlestation** built to dominate task management, crushing productivity metrics like it's nobody's business. This is your team's new best friend—a sophisticated, AI-powered collaboration machine that turns scattered workflows into streamlined excellence.

Think of it as:
- 🎯 **Laser-focused task tracking** on steroids
- 🤖 **AI-powered insights** that actually make sense
- 👥 **Team collaboration** that doesn't suck
- 📊 **Real-time analytics** that blow your mind
- ⚡ **Performance that makes other tools look like they're sleeping**

---

## 🎪 Feature Extravaganza

### 🔐 **Authentication: Fort Knox Level Security**
- JWT access tokens with bulletproof protection
- httpOnly refresh cookies (hackers hate this one trick!)
- bcrypt password hashing because we actually care about security
- Session management that won't give you nightmares

### 👑 **RBAC: Role-Based Access Control**
- Admin & Member roles with granular permissions
- Route-level authorization that keeps the bad guys out
- Fine-grained control over who touches what

### 📂 **Projects: Full CRUD Symphony**
- Create, Read, Update, Delete projects with lightning speed
- Team member management that's intuitive and powerful
- Real-time progress tracking that keeps everyone in sync
- Project templates to bootstrap faster than you can say "Agile"

### 🎯 **Tasks: The Kanban Board from Heaven**
- Drag-and-drop Kanban board that feels buttery smooth
- Priority levels because not everything is equally urgent
- Deadline tracking with visual heatmaps
- Subtasks support for breaking down the complex

### 📊 **Dashboard: Your Command Center**
- **Live Stats** — See your metrics in real-time
- **Interactive Charts** — Understand your data at a glance
- **Activity Feed** — Stay in the loop, always
- **AI Productivity Insights** — Machine learning that actually helps (not just hype)

### 👨‍💼 **Team Management: The Roster That Rocks**
- Crew roster with real-time availability
- Task/project assignment counts at your fingertips
- Performance metrics that matter
- Burndown charts that tell the truth

### 📈 **Analytics: Data Visualization on Overdrive**
- Priority distribution breakdown
- Productivity radar charting your team's mojo
- Deadline heatmaps showing crunch time at a glance
- Trend analysis that predicts problems before they happen

### ✨ **UX: User Experience Designed by Perfectionists**
- Command palette (⌘K) for power users
- Toast notifications that don't annoy
- Skeleton loaders for that premium feel
- Framer Motion animations that pop
- Dark mode because we respect your eyes

---

## 🛠️ The Tech Stack (The Good Stuff)

| Layer | Technologies | Status |
|-------|-------------|--------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Recharts, Framer Motion, @dnd-kit | 🔥 Blazing Fast |
| **Backend** | Node.js, Express 5, Prisma 6 ORM, PostgreSQL | 💪 Bulletproof |
| **Authentication** | JWT, bcryptjs, express-validator | 🔒 Fort Knox |
| **Deployment** | Railway (Production), Docker Compose (Local) | 🚀 Ready to Launch |
| **Real-time** | WebSocket support (Vercel-limited) | ⚡ Lightning |

---

## 📦 Monorepo Architecture

```
ethara-ai/
├── 🎨 apps/
│   ├── client/              # React 19 + Vite masterpiece
│   │   ├── src/
│   │   │   ├── pages/       # Route pages
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── lib/         # API calls & utilities
│   │   │   └── contexts/    # AuthContext & global state
│   │   └── vite.config.ts
│   │
│   └── server/              # Express API powerhouse
│       ├── src/
│       │   ├── routes/      # API endpoints
│       │   ├── controllers/ # Business logic
│       │   ├── services/    # Core logic
│       │   ├── middleware/  # Auth & validation
│       │   └── prisma/      # Database schema
│       └── .env.example
│
├── docker-compose.yml       # Local PostgreSQL
├── railway.json             # Railway config
├── vercel.json              # Vercel config
└── package.json             # npm workspaces magic
```

---

## ⚡ Quick Start: Get This Beast Running in 5 Minutes

### Prerequisites
- **Node.js 20+** (older versions need not apply)
- **Docker** (optional, for PostgreSQL—but recommended)

### Step 1: Clone & Conquer
```bash
git clone https://github.com/Abhishek2114/Ethara-AI-.git ethara-ai
cd ethara-ai
npm install
```

### Step 2: Configure Environment
```bash
cp apps/client/.env.example apps/client/.env
cp apps/server/.env.example apps/server/.env
```

### Step 3: Choose Your Database Path

#### 🛤️ **Option A: SQLite (Recommended for Dev)**
```bash
npm run setup:local
```
This creates a local SQLite database, seeds demo data, and you're ready to roll.

#### 🐘 **Option B: PostgreSQL (Recommended for Production)**
```bash
# Start PostgreSQL container
npm run docker:up

# Set up database
npm run db:deploy
npm run db:seed

# Configure JWT secrets in apps/server/.env
# JWT_ACCESS_SECRET=your-super-secret-key-32-chars-min
# JWT_REFRESH_SECRET=your-another-secret-32-chars-min
```

### Step 4: Fire It Up
```bash
npm run dev
```

🎉 **Done!** Your setup is live:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs

### Demo Accounts (Use These to Explore)

| Role | Email | Password | Superpowers |
|------|-------|----------|-------------|
| 👑 Admin | admin@ethara.app | Admin123! | Full system access |
| 👤 Member | alex@ethara.app | Member123! | Task assignments & execution |

---

## 🔧 Environment Variables: Configure Like a Pro

### Server Configuration (`apps/server/.env`)

```env
# Database (choose one)
DATABASE_URL=postgresql://user:password@localhost:5432/ethara

# Authentication - Use strong, random 32+ character strings!
JWT_ACCESS_SECRET=your-super-duper-secret-access-token-key-here
JWT_REFRESH_SECRET=your-super-duper-secret-refresh-token-key-here

# Token Expiry
JWT_ACCESS_EXPIRES_IN=15m      # Access token lifespan
JWT_REFRESH_EXPIRES_IN=7d      # Refresh token lifespan

# Network & CORS
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
PORT=3000

# Production Only
COOKIE_SECURE=true             # HTTPS only in production
NODE_ENV=production
```

### Client Configuration (`apps/client/.env`)

```env
# Leave empty in dev to use Vite proxy
# In production, set to your API endpoint
VITE_API_URL=https://api.yourdomain.com
```

---

## 🌐 API Reference: The Complete Arsenal

**Base URL:** `/api` or your deployed URL

### 🔐 Authentication Endpoints
```
POST   /auth/register           # Create new account
POST   /auth/login              # Get access & refresh tokens
POST   /auth/refresh            # Refresh access token
POST   /auth/logout             # Destroy session
GET    /auth/me                 # Get current user (requires Bearer token)
```

### 📂 Projects API
```
GET    /projects                # List all projects
POST   /projects                # Create new project
GET    /projects/:id            # Get project details
PUT    /projects/:id            # Update project
DELETE /projects/:id            # Delete project
```

### 🎯 Tasks API
```
GET    /tasks                   # Fetch all tasks
POST   /tasks                   # Create task
POST   /tasks/reorder           # Reorder tasks in Kanban
GET    /tasks/:id               # Get task details
PUT    /tasks/:id               # Update task (status, assignee, etc)
DELETE /tasks/:id               # Delete task
```

### 📊 Dashboard & Analytics
```
GET    /dashboard/stats         # Fetch stats & metrics
GET    /team                    # Get team roster & performance
GET    /health                  # Health check (no auth needed)
```

---

## 🏗️ Architecture: How the Magic Works

```
┌──────────────────────────────────────────────────────────┐
│  🎨 Frontend Layer                                       │
│  ┌─────────────┐      Vite dev server with HMR         │
│  │  React 19   │      Command Palette (⌘K)             │
│  │  Vite       │      Smooth animations & transitions   │
│  │  TailwindCSS│      Responsive design                │
│  └──────┬──────┘                                        │
└─────────┼────────────────────────────────────────────────┘
          │
          │ HTTPS + JWT Bearer Token
          │
┌─────────▼────────────────────────────────────────────────┐
│  🔌 API Layer (Express 5)                               │
│  ┌─────────────────────────────────────────┐            │
│  │  Routes → Controllers → Services        │            │
│  │  - Input Validation (express-validator) │            │
│  │  - Error Handling (Custom middleware)   │            │
│  │  - Rate limiting                        │            │
│  │  - CORS protection                      │            │
│  └──────────────────┬──────────────────────┘            │
└─────────────────────┼────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼────┐           ┌───────▼──────┐
    │ Prisma  │           │ Cache Layer  │
    │ ORM     │           │ (Optional)   │
    └────┬────┘           └──────────────┘
         │
    ┌────▼──────────────┐
    │ 🐘 PostgreSQL    │
    │ - Production DB  │
    │ - Migrations     │
    │ - Indexing       │
    └───────────────────┘
```

**Data Flow:**
- **Frontend:** Pages → Components → API calls via `lib/api.ts`
- **Backend:** Routes receive requests → Controllers validate & authorize → Services execute business logic → Prisma ORM queries database
- **Auth:** JWT stored in memory (access) + httpOnly cookies (refresh)

---

## 🚀 Deployment: Go Global

### Railway Deployment (Recommended)

1. **Create Railway Project** → Connect this GitHub repo
2. **Add PostgreSQL Plugin** → Copy `DATABASE_URL` env var
3. **Create Services:**
   - API Service: `apps/server`, start command: `node src/index.js`
   - Web Service: `apps/client`, build: `npm run build`
4. **Set Environment Variables** on API service:
   ```
   DATABASE_URL=<from PostgreSQL plugin>
   JWT_ACCESS_SECRET=<your-secret>
   JWT_REFRESH_SECRET=<your-secret>
   CORS_ORIGIN=https://your-railway-domain.app
   COOKIE_SECURE=true
   NODE_ENV=production
   ```
5. **Set Client Env:** `VITE_API_URL=https://your-api.railway.app`
6. **Deploy** → Automatic migrations run on deploy!

### Vercel Deployment (Full Stack)

1. **Connect Repository** to Vercel
2. **Vercel Build:**
   - Builds Vite client
   - Routes `/api/*` to Express serverless functions
3. **Environment Variables:**
   ```
   DATABASE_URL=<Postgres URL>
   JWT_ACCESS_SECRET=<secret>
   JWT_REFRESH_SECRET=<secret>
   CORS_ORIGIN=https://your-vercel-domain.vercel.app
   COOKIE_SECURE=true
   ```
4. **Deploy** → Live!

**Note:** Real-time sockets (Socket.IO) won't work on Vercel serverless. Use Railway or similar for real-time features.

### Docker Compose (Local Development)

```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations & seed
npm run db:migrate
npm run db:seed

# Start dev servers
npm run dev
```

---

## 📝 Available Scripts: Your Command Arsenal

```bash
npm run dev              # 🚀 Start dev mode (API + Client)
npm run build            # 📦 Build for production
npm run db:migrate       # 🗄️  Run pending migrations
npm run db:seed          # 🌱 Seed with demo data
npm run setup:local      # 🏠 One-command local setup with SQLite
npm run docker:up        # 🐳 Start Docker Postgres
npm run docker:down      # 🛑 Stop Docker Postgres
npm run lint             # 🔍 Check code quality
npm run test             # ✅ Run tests
```

---

## 🎯 Project Structure Deep Dive

```
apps/client/
├── src/
│   ├── pages/           # Route pages (Dashboard, Projects, Tasks, etc)
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI (buttons, inputs, cards)
│   │   ├── forms/      # Complex forms
│   │   └── layouts/    # Page layouts
│   ├── contexts/        # AuthContext, ThemeContext
│   ├── hooks/          # Custom React hooks
│   ├── lib/
│   │   ├── api.ts      # Axios instance & API calls
│   │   ├── utils.ts    # Utility functions
│   │   └── constants.ts
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
└── vite.config.ts

apps/server/
├── src/
│   ├── routes/         # API route definitions
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/         # TypeScript interfaces
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── utils/          # Helper functions
│   ├── index.ts        # Express setup
│   └── config.ts       # Configuration
├── migrations/         # Database migrations
└── .env.example
```

---

## 🔒 Security Features (Sleep Soundly)

✅ **JWT-based stateless authentication**  
✅ **bcrypt password hashing with salt rounds**  
✅ **httpOnly cookies prevent XSS attacks**  
✅ **CORS protection with configurable origins**  
✅ **Input validation on all endpoints**  
✅ **Rate limiting (recommended addition)**  
✅ **SQL injection protection via Prisma ORM**  
✅ **HTTPS enforcement in production**  

---

## 🎨 UI/UX Magic (Why Users Love It)

- ⚡ **Command Palette** — Press ⌘K to access any feature instantly
- 🎬 **Smooth Animations** — Framer Motion brings life to the interface
- 🌈 **Tailwind CSS v4** — Utility-first styling at lightspeed
- 📱 **Fully Responsive** — Works on mobile, tablet, desktop seamlessly
- 🌙 **Dark Mode Support** — Because developers prefer the darkness
- ♿ **Accessibility** — WCAG compliance (working towards it)
- 🎯 **Drag-and-Drop** — @dnd-kit powers smooth Kanban interactions

---

## 🐛 Troubleshooting: When Things Go Sideways

### "Database connection refused"
```bash
# Check if PostgreSQL is running
docker-compose ps

# If not running:
npm run docker:up
```

### "JWT token expired"
```bash
# Refresh tokens automatically, but if stuck:
1. Clear browser cookies
2. Log out and log back in
3. Check JWT_REFRESH_SECRET in .env
```

### "CORS errors in browser console"
```bash
# Update CORS_ORIGIN in apps/server/.env
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

### "Port 3000/5173 already in use"
```bash
# Kill existing process:
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

---

## 📚 Learning Resources

- **React 19:** https://react.dev
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Railway Docs:** https://docs.railway.app

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repo**
2. **Create a feature branch:** `git checkout -b feature/amazing-thing`
3. **Commit changes:** `git commit -m "Add amazing thing"`
4. **Push branch:** `git push origin feature/amazing-thing`
5. **Open a Pull Request** with description

**Code Standards:**
- Follow ESLint rules
- Use TypeScript strict mode
- Write tests for new features
- Keep commits atomic and descriptive

---

## 📄 License

ISC — Do whatever you want with this project (but credit is appreciated!)

---

## 🎉 Final Thoughts

**Ethara AI** is built for teams that refuse to compromise on quality, speed, and user experience. It's not just a tool—it's a philosophy. A commitment to excellence. A beast mode project management system that laughs in the face of chaos.

Ready to dominate your workflow? Let's go! 🚀

---

<div align="center">

**Built with ❤️ by [Abhishek2114](https://github.com/Abhishek2114)**

⭐ If you find this useful, please star the repo!

</div>
