# 🕌 Al-Maqra'a - Quran School Management System

A next-generation Islamic school management system that connects students, teachers, and parents to the Quran through a premium, distraction-free, and motivating interface.

## ✨ Vision

Al-Maqra'a (المقرأة) is a spiritual yet deeply technological ecosystem designed with the **"Digital Noor"** design philosophy - combining modern web technology with the reverence and beauty befitting Quranic education.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Backend**: [Convex](https://convex.dev) - Real-time database and serverless functions
- **Authentication**: [Clerk](https://clerk.com) - User management with role-based access
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui, Radix UI primitives
- **Animation**: Framer Motion
- **Language**: TypeScript

## 🎯 Key Features

### Multi-Role Dashboard System
- **👨‍🎓 Student Dashboard**: Progress tracking, assignments, and gamified learning
- **👨‍🏫 Teacher Dashboard**: Class management, attendance, grading, and analytics
- **👪 Parent Dashboard**: Monitor child's progress and communication
- **⚙️ Admin Dashboard**: Staff management, financial oversight, and system administration

### Core Functionality
- 📚 **Halaqa Management**: Create and manage Quran study circles
- ✅ **Attendance Tracking**: Real-time attendance with analytics
- 📊 **Progress Monitoring**: Track Hifz and Nazra progress
- 💰 **Payment System**: Student fee management and tracking
- 📝 **Assignment System**: Create and grade assignments
- 🌙 **RTL Support**: Full Arabic and Somali language support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Convex account ([sign up](https://convex.dev))
- Clerk account ([sign up](https://clerk.com))

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file with:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOYMENT=your_convex_deployment_name
```

3. **Run Convex setup**:
```bash
npx convex dev
```

4. **Start the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Design Documentation

For detailed design philosophy, UI/UX specifications, and feature roadmap, see [quraan.md](./quraan.md).

## 🔐 Role-Based Access

The system implements secure role-based routing:
- `/dashboard/student` - Student interface
- `/dashboard/teacher` - Teacher management tools
- `/dashboard/parent` - Parent monitoring dashboard
- `/dashboard/admin` - Administrative controls
- `/onboarding` - New user role selection

## 🌐 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
# Connect to Vercel
vercel

# Deploy to production
vercel --prod
```

Make sure to configure environment variables in your Vercel project settings.

## 📝 License

This project is private and proprietary.

---

**Built with love for the Muslim community** 🤲
