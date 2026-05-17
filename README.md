# AstralHQ — Enterprise AI Workforce Operations Platform

AstralHQ by Ethara AI is a production-grade, dark-luxury workforce operations platform designed to orchestrate hybrid team workflows, manage task queues, track attendance auditing under regulatory standards, and deliver high-density operational telemetry.

---

## 🎯 Platform Overview

AstralHQ unites human workforce auditing and AI intelligence workflows into a high-contrast command dashboard. It acts as an operational mission control for modern organizations that require precise session logging, project allocating, and real-time status reporting.

* **Unified Control**: Replaces segmented tracking spreadsheets with a single, high-fidelity operations interface.
* **Compliance Standards**: Designed to audit check-in/check-out durations, calculate daily scores, and generate immutable logs for compliance standards.
* **Role-Based Telemetry**: Separate interfaces and permissions for Administrators, Project Leads, Quality Reviewers, and Taskers.

---

## 🏗️ System Architecture

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
                     │   SQLite Database      │
                     │    (Local Dev DB)      │
                     └────────────────────────┘
```

---

## ✨ Features

### 1. Operations Telemetry & Command Center
* **Workspace Switcher**: Seamlessly switch between enterprise organizational units.
* **⌘K Global Command Palette**: Open search capabilities using `Cmd+K` keyboard shortcuts to navigate resources, tasks, and team indexes instantly.
* **12-Column High-Density Grid**: Interface widgets sized perfectly to optimize viewport space, presenting maximum context with a premium visual hierarchy.

### 2. Full-Suite Attendance Auditing
* **Visual Work-Duration Clocks**: Live timers showing active check-in durations to the exact second.
* **7-Day Action Grid**: Visual matrix displaying previous work states, average session scores, and overall status (Present, Late, Absent).
* **Automatic Status Seeding**: Daily cron-like checks that pre-initialize missing dates for all active members, applying leaves or marking absentees.
* **Reports Panel**: Generate daily attendance analytics, export historical tables, and audit time entries easily.

### 3. Comprehensive Task & Project Controls
* **Kanban Boards**: Drag, drop, and review task states dynamically.
* **Review Gateways**: Dedicated validation steps for Quality Reviewers to score and sign off on completed work before merging.

---

## 🛠️ Technical Stack

* **Frontend**: React.js, Vite Dev Server, Tailwind CSS (v4 Architecture), Lucide Icons, Axios Client.
* **Backend**: Node.js, Express Framework, Socket.IO WebSockets.
* **Data Layer**: Prisma ORM, SQLite database (`apps/server/data/dev.db`).

---

## 🔑 Environment Setup

Create a `.env` file in `apps/server/`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:../data/dev.db"
JWT_ACCESS_SECRET="your-high-security-jwt-secret-key"
JWT_REFRESH_SECRET="your-high-security-refresh-secret-key"
```

---

## ⚡ Quick Start

### 1. Install Workspace Dependencies
Execute this from the root directory to install all monorepo dependencies:
```bash
npm install
```

### 2. Initialize and Seed the Database
Synchronize your Prisma schema and seed the default roles/members:
```bash
# Generate the client and apply SQLite database migrations
npm run db:deploy --workspace=apps/server

# Seed standard accounts and roles
npm run db:seed --workspace=apps/server
```

### 3. Run Development Servers
Boot the backend server (Port 3000) and the frontend Vite compiler (Port 5173):
```bash
# Start backend
npm run dev:server

# Start frontend
npm run dev:client
```

Open **`http://localhost:5173/`** in your browser.

---

## 🔒 Default Seed Credentials

Use these default accounts to explore the control dashboards:

| Role | Username | Password |
|---|---|---|
| **Quality Reviewer** | `abhishek.singh23@ethara.ai` | `Admin123!` |
| **Project Lead** | `piyush.tomar@ethara.ai` | `Admin123!` |
| **Tasker / Engineer** | `tasker1@ethara.ai` | `Member123!` |

---

## 📜 License

Distributed under the MIT License. Copyright &copy; 2026 Ethara AI.
