# SYNCD — Next-Gen Agile Project Management & Team Collaboration Platform

![Next.js](https://img.shields.io/badge/Next.js-14.2.14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)

A modern, full-stack project management platform built with **Next.js 14 (App Router)**, **Prisma**, **PostgreSQL**, **Clerk Authentication**, and **Tailwind CSS**. Designed with sleek dark aesthetics, real-time live synchronization, instant team invite codes, and a keyboard-first Linear-inspired workflow.

---

## ✨ Key Features & Innovations

### 🚀 1. Real-Time Interactive Sprint Board
- **Drag-and-Drop Workflow**: Smooth task reordering and status column progression powered by `@hello-pangea/dnd`.
- **Zero-Latency Optimistic Updates**: Tasks appear, update, and delete instantly with 0ms delay.
- **Live Background Heartbeat**: Automatic multi-user synchronization keeping all active sprint boards updated live without manual page reloads.
- **Sprint Management**: Plan, start, and complete sprints with overdue tracking and active status badges.

### 🔑 2. Unique Organization Join Code System
- **1-Click Team Onboarding**: Solves empty organization sprawl by allowing team members to join existing workspaces using a unique 6-digit code (`SYNCD-XXXXXX`) or direct share link.
- **Admin Regeneration Controls**: Workspace admins can view, copy, or regenerate invite codes anytime.
- **Instant Role Enrollment**: Automatically assigns team member permissions upon code entry.

### 🎯 3. Linear-Inspired Fast Issue Creator
- **Keyboard-First Experience**: Create and save issues instantly with **`Ctrl + Enter`** / **`Cmd + Enter`**.
- **Interactive Priority Control**: 4-button segmented selector with active status indicators (🟢 Low, 🔵 Medium, 🟡 High, 🔴 Urgent).
- **1-Click Description Templates**: Instant templates for **⚡ User Stories**, **🐞 Bug Reports**, and **📋 Task Checklists**.
- **Live Write & Preview**: Distraction-free markdown editor with instant preview.

### 💬 4. Integrated Team Collaboration Hub
- **Real-Time Project Chat**: Persistent workspace chat channel for team discussions and quick sprint coordination.
- **Floating Chat Widget**: Access team discussions from any project view with unread badges and user avatars.

### 📅 5. Polished Sprint Calendar & Duration Presets
- **Custom Date Range Picker**: Dark glassmorphic calendar with gradient range selection pills.
- **1-Click Duration Chips**: Fast presets for **1 Week (7d)**, **2 Weeks (14d)**, **3 Weeks (21d)**, and **4 Weeks (28d)**.

### 🔐 6. Enterprise-Grade Multi-Tenant Authentication
- Full Clerk integration for secure sign-in, user profiles, and organization switching.
- Role-based permissions protecting admin-only board moves and sprint state changes.
- Automated email alerts upon task assignment.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Frontend**: [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) with [PostgreSQL / Supabase](https://supabase.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Email Notifications**: Resend / SMTP

---

## 📂 Project Structure

```text
├── actions/                  # Next.js Server Actions (issues, sprints, projects, chat, invites)
├── app/
│   ├── (auth)/               # Clerk Sign-In & Sign-Up routes
│   ├── (main)/
│   │   ├── onboarding/       # Join with Code & Create Workspace hub
│   │   ├── organization/     # Organization dashboard & team chat
│   │   └── project/          # Sprint boards, issue creation, & filters
│   ├── globals.css           # Design tokens, gradients, and custom utility classes
│   └── page.js               # Landing page
├── components/
│   ├── ui/                   # Reusable UI primitives (dialog, calendar, select, button, etc.)
│   ├── custom-create-org.jsx # Custom workspace creation form
│   ├── issue-card.jsx        # Draggable issue card with priority accents
│   ├── org-invite-button.jsx # 1-click invite code generator & modal
│   ├── chat-widget.jsx       # Real-time team collaboration widget
│   └── logo.jsx              # SYNCD brand logo component
├── prisma/
│   └── schema.prisma         # Database schema (User, Project, Sprint, Issue, Chat, Invite)
└── public/                   # Static assets & brand media
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/niksin2614/SAAS-Project-Management-.git
cd SAAS-Project-Management-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:

```env
# Database (Supabase / PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URL Paths
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# (Optional) Email Service
RESEND_API_KEY=re_...
```

### 4. Run Prisma Database Migrations
```bash
npx prisma generate
npx prisma db push
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables from your `.env` in the Vercel project settings.
4. Deploy! Vercel will automatically run `prisma generate` and `next build`.
5. Add your Vercel production domain to the allowed redirect origins in the **Clerk Dashboard**.

---

## 📄 License

This project is licensed under the MIT License.
