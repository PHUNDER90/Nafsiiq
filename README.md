<<<<<<< HEAD
<div align="center">

# 🧠 Nafsiiq

### MBTI Personality Intelligence Platform
**اكتشف شخصيتك الحقيقية — Discover Your True Personality**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.2-green?logo=mongodb)](https://www.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Description

**Nafsiiq** is a full-stack, bilingual (Arabic / English) personality assessment platform built on the **Myers-Briggs Type Indicator (MBTI)** framework. Users complete a 40-question test and instantly receive a rich, visualised personality profile — complete with interactive charts, career guidance, strength/weakness breakdowns, and famous people who share their type.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎯 **MBTI Test Engine** | 40 standardised questions across 4 dimensions |
| 📊 **Data Visualisation** | Radar chart, dimension bars, percentage scores |
| 🌍 **Bilingual UI** | Full Arabic (RTL) & English (LTR) support |
| 🎨 **Modern Design** | Tailwind CSS v4, Framer Motion animations |
| 👤 **Rich Profiles** | Strengths, weaknesses, careers, famous people |
| 🔐 **Secure Auth** | JWT-based authentication with bcrypt |
| 💾 **Result History** | Save and review past test results |
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
- [MongoDB 8.2](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [Zustand](https://zustand-demo.pmnd.rs) — state management
- [JWT](https://jwt.io) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## 📸 Screenshots

> Add screenshots to `/public/screenshots/` and uncomment below

<!--
| Landing Page | Test Screen | Results Page |
|---|---|---|
| ![Landing](public/screenshots/landing.png) | ![Test](public/screenshots/test.png) | ![Results](public/screenshots/results.png) |
-->

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** 8.0+ (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/Ya-az/Nafsiiq.git
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

Open `.env.local` and fill in your values (see [Environment Variables](#-environment-variables) below).

### 4. Start MongoDB (local)

```bash
# macOS — Homebrew
brew services start mongodb-community

# Linux — systemd
sudo systemctl start mongod
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root (use `.env.example` as a template):

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (≥32 chars) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL of the app |

> ⚠️ **Never commit `.env.local` — it is listed in `.gitignore`.**

---

## 📂 Project Structure

```
nafsiiq/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login & Register pages
│   │   ├── (dashboard)/         # Test, Results, Reports
│   │   └── api/                 # REST API routes
│   ├── components/
│   │   ├── test/                # LikertScale, ProgressBar, QuestionCard…
│   │   ├── results/             # TypeHeroCard, DimensionBars, RadarChart…
│   │   ├── landing/             # HeroSection, FeatureCards…
│   │   └── ui/                  # Button, Card, Skeleton…
│   ├── lib/
│   │   ├── mbti/
│   │   │   ├── calculator.ts    # Scoring logic
│   │   │   ├── questions.ts     # 40 questions
│   │   │   └── personalities.ts # 16 type profiles (EN + AR)
│   │   └── db/                  # Mongoose models & connection
│   ├── contexts/                # AuthContext, LanguageContext
│   ├── store/                   # Zustand stores
│   └── types/                   # Global TypeScript types
├── public/
├── .env.example                 # Template — safe to commit
├── .env.local                   # Secrets — NEVER commit
└── README.md
```

---

## 🎮 Scripts

```bash
npm run dev        # Development server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
```

---

## 🔮 Future Improvements

- [ ] OAuth (Google / GitHub) sign-in
- [ ] PDF report export
- [ ] Team / group personality compatibility feature
- [ ] Admin psychologist dashboard
- [ ] Push notifications & reminders
- [ ] Progressive Web App (PWA) support
- [ ] Dark / Light mode toggle
- [ ] More personality frameworks (Big Five, Enneagram)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📝 License

Distributed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ · <strong>Nafsiiq</strong>
</div>
=======
# Nafsiiq
..
>>>>>>> 7bfa6af409c2865a8953af3f1be7d419b1631f6d
