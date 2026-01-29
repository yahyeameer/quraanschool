# Khalaf Al-Cuduul Quran School Management System

**Date**: 2026-01-21
**Prepared By**: Software Development Manager

## Product Overview
Khalaf Al-Cuduul is a next-generation Islamic school management platform designed to streamline Quranic education administration by combining modern web technologies with spiritual reverence. It provides comprehensive tools for academic management, financial oversight, communication, operations, and detailed role-based dashboards for all school stakeholders.

## Core Goals
- Provide a seamless and secure multi-role authentication and onboarding experience.
- Enable role-specific dashboards and functionalities for Admins, Teachers, Parents, Students, Accountants, Librarians, and Managers.
- Facilitate comprehensive academic management including classes, assignments, attendance, and student progress tracking.
- Offer robust financial management tools covering billing, payments, salaries, and expenses.
- Support efficient communication and collaboration through messaging, notifications, and live video integration.
- Manage school operations including transport, library, and scheduling effectively.
- Deliver a premium, responsive UI optimized for Arabic, English, and Somali users with RTL support.

## Key Features
- **Multi-role Authentication & Role-based Onboarding** using Clerk for enterprise-grade security.
- **Distinct dashboards** customized per role: Admin, Manager, Teacher, Student, Parent, Accountant, Librarian.
- **Academic management modules**: Class (Halaqa) management, assignments, attendance tracking, progress analytics, and digital logbooks.
- **Financial management**: billing, payments, detailed invoicing, salary management, and expense tracking with visual financial analytics.
- **Communication features** including a real-time messaging system, notifications, and integrated LiveKit video conferencing.
- **School operation tools** like transport route and driver management, real-time status tracking, and a comprehensive library catalog with loan tracking.
- **Gamification engine** rewarding student engagement via points, badges, streaks, and a leaderboard.
- **Advanced analytics and reporting tools** for academic velocity, attendance trends, and performance benchmarking.
- **Modern UI/UX** with liquid glass design, dynamic colors, smooth animations, RTL support, and full responsiveness.

## User Flow Summary
- User authentication with Clerk enabling secure access and smooth onboarding by role assignment.
- Upon login, users are directed to their dedicated dashboard tailored to their role with relevant features and data.
- Teachers create and manage Halaqa sessions, track attendance, record student progress, and assign homework.
- Parents monitor their child's performance, communicate directly with teachers, and manage fee payments.
- Accountants oversee financial activities including billing, revenue tracking, and expense management through their portal.
- Librarians manage library inventory, loans, and view usage statistics within their dashboard.
- Transport coordinators manage routes, drivers, and track vehicle status linking communication for emergencies.
- Students engage with their dashboards to track progress, complete assignments, and participate in gamification features driving motivation.

## Validation Criteria
- All user roles authenticate securely with Clerk and transition smoothly through the onboarding flow.
- Role-specific dashboards and features load correctly per the authenticated user's role without data leakage.
- Academic modules accurately reflect class schedules, attendance, assignments, and progress with no data inconsistency.
- Financial transactions including billing, payments, and salaries process correctly with accurate reporting and analytics visuals.
- Real-time messaging and notifications deliver instant updates and LiveKit video sessions function without interruptions.
- Transport and library management records update in real-time and reflect accurate statuses and inventories.
- UI supports full RTL languages with responsiveness across desktop, tablet, and mobile devices.
- Gamification features track points, badges, streaks, and leaderboard standings reliably, encouraging sustained engagement.

## Technical Summary
**Tech Stack**: TypeScript, Next.js, Convex, Tailwind CSS, Clerk, LiveKit, Shadcn UI, Framer Motion

**Key Feature Modules**:
- **Authentication**: `convex/auth.config.ts`, `app/onboarding`
- **Dashboards**: `app/dashboard`, `convex/admin.ts`, `convex/teacher.ts`
- **Academic**: `convex/classes.ts`, `app/halaqa`, `app/assignments`
- **Financial**: `convex/billing.ts`, `app/pricing`
- **Communication**: `convex/messages.ts`, `convex/livekit.ts`
- **Operations**: `convex/transport.ts`, `convex/library.ts`
