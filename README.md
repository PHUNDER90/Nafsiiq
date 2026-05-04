<div align="center">

# نفسيّك — Nafsiiq

### Arabic Personality Assessment Platform
**اكتشف شخصيتك الحقيقية — Discover Your True Personality**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[🌐 Live Demo](https://nafsiiq-production.up.railway.app)**

</div>

---

## 📖 Description

**Nafsiiq** is a full-stack bilingual (Arabic / English) personality assessment platform. Users complete a 24-question Arabic test and receive a detailed personality profile scored across **10 personality archetypes**. Licensed psychologists can review results and add personalised notes. Admins manage users and monitor platform statistics.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎯 **Personality Test** | 24 Arabic questions across 5 psychological axes |
| 📊 **Rich Results** | Percentage breakdown across all 10 personality types |
| 🧠 **10 Archetypes** | Unique Arabic personality types with traits & career paths |
| 🌍 **Bilingual UI** | Full Arabic (RTL) & English (LTR) support |
| 🎨 **Modern Design** | Tailwind CSS v4, Framer Motion animations |
| 🔐 **Secure Auth** | JWT authentication with bcrypt (12 rounds) |
| 👨‍⚕️ **Psychologist Panel** | Review sessions and add professional notes |
| 🛡️ **Admin Dashboard** | User management, stats, personality distribution chart |
| 💾 **Test History** | Save and review all past results |
| 📄 **PDF Export** | Download your personality report |
| 📱 **Responsive** | Mobile-first layout |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16.2](https://nextjs.org) — App Router + Turbopack
- [React 19](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion v12](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)

**Backend & Data**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL](https://www.postgresql.org) + [Prisma 7](https://www.prisma.io)
- [Zustand](https://zustand-demo.pmnd.rs) — test session state
- [JWT](https://jwt.io) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

**Hosting**
- [Railway](https://railway.app) — app + managed PostgreSQL

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **PostgreSQL** 14+ (local or hosted)

### 1. Clone the repository

```bash
git clone https://github.com/PHUNDER90/Nafsiiq.git
cd Nafsiiq
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/nafsiiq
JWT_SECRET=your-super-secret-jwt-key-32chars-min
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

```bash
# Push schema to your PostgreSQL database
npx prisma db push

# Seed personalities, questions and scoring data
npx tsx prisma/seed.ts

# Create admin & psychologist accounts
npx tsx scripts/create-accounts.ts
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (≥32 chars) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL of the app |

> ⚠️ **Never commit `.env.local` — it is listed in `.gitignore`.**

---

## 📂 Project Structure

```
nafsiiq/
├── prisma/
│   ├── schema.prisma        # Database schema (8 models)
│   └── seed.ts              # Seed personalities, questions & scores
├── scripts/
│   └── create-accounts.ts   # Create admin & psychologist accounts
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Register pages
│   │   ├── (dashboard)/     # Dashboard, Test, Results, Reports, Settings
│   │   ├── (admin)/         # Admin panel & user management
│   │   ├── (psychologist)/  # Psychologist panel
│   │   └── api/             # REST API routes
│   ├── components/
│   │   ├── test/            # QuestionCard, ProgressBar
│   │   ├── ui/              # Button, Card, Input, Skeleton…
│   │   └── shared/          # Logo
│   ├── lib/
│   │   ├── auth/            # JWT helpers, API auth middleware
│   │   ├── db/              # Prisma client, formatters
│   │   ├── personality/     # 10 personality definitions, calculator
│   │   └── i18n/            # EN + AR translations
│   ├── contexts/            # AuthContext, ThemeContext, LanguageContext
│   ├── store/               # Zustand test session store
│   └── types/               # Global TypeScript types
├── .env.example             # Template — safe to commit
├── railway.json             # Railway deployment config
└── .node-version            # Node 22 (required)
```

---

## 🎮 Scripts

```bash
npm run dev        # Development server (Turbopack)
npm run build      # Production build (runs prisma generate first)
npm run start      # Start production server
npm run lint       # ESLint
```

---

## 👥 Roles

| Role | Access |
|---|---|
| **User** | Take tests, view own results, export PDF |
| **Psychologist** | View all sessions, add professional notes |
| **Admin** | Full access — user management, platform statistics |

---

## 🔮 Roadmap

- [ ] Admin UI for creating psychologist / admin accounts
- [ ] Role promotion from admin panel
- [ ] Rate limiting on auth endpoints
- [ ] OAuth (Google) sign-in
- [ ] Custom domain
- [ ] PWA support

---

## 📝 License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ · <strong>Nafsiiq — نفسيّك</strong>
</div>
