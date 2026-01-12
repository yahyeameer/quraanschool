# 🕌 Al-Maqra'a: The Next-Gen Quran School System

**Vision:** A spiritual yet deeply technological ecosystem that connects students to the Quran through a premium, distraction-free, and motivating interface.

---

## 🎨 UI/UX Design Language: "Digital Noor"

We will move beyond standard SaaS design into a custom **"Digital Noor" (Light)** design system.

### 1. Aesthetic Philosophy
*   **Theme:** "Tahajjud & Fajr"
    *   **Light Mode (Fajr):** Soft cream backgrounds (`#FDFBF7`), Paper textures, Emerald Green text (`#064e3b`), Gold accents for achievements.
    *   **Dark Mode (Tahajjud):** Deep Indigo/Slate (`#0f172a`), Glowing text effects, muted silver for secondary text.
    *   **Font:** **Inter** (UI) + **Amiri Quran** (Script) + **Noto Naskh Arabic** (Reading).

### 2. "WOW" Factors & Micro-interactions
*   **Bismillah Loading Screen:** An animated Arabic calligraphy Bismillah that draws itself on the screen (using SVG path animation) before the app loads.
*   **The "Hafiz" Journey:** Instead of a list, visualize progress as a **Golden Path** map (like Duolingo but elegant) where each Surah is a glowing node.
*   **Realistic Mushaf:** When reading, use page-turn animations (using `framer-motion`) to mimic a physical Mushaf.

---

## 🛠 Enhanced Functional System Architecture

### 1. Authentication & Roles (Clerk)
*   **Student:** Access to specific Halaqas, Progress Tracker, Gamified Dashboard.
*   **Teacher:** "Cockpit View" for live sessions, Rapid Grading, Attendance.
*   **Parent:** Read-only "Peace of Mind" dashboard showing child's consistency and teacher notes.
*   **Admin:** Financials, Teacher Allocation, User Management.

### 2. The Database Connective Tissue (Convex Schema Refined)

We need slightly more robust relationships for a full LMS.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(), // "admin" | "teacher" | "student" | "parent"
    avatarUrl: v.optional(v.string()), 
    streak: v.optional(v.number()), // Gamification
  }).index("by_clerkId", ["clerkId"]),

  // Group/Class Management
  classes: defineTable({
    name: v.string(),
    teacherId: v.id("users"),
    schedule: v.array(v.object({ day: v.string(), time: v.string() })),
    category: v.string(), // "Hifz", "Nazra", "Tajweed"
  }),

  // Connecting Students to Classes
  enrollments: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    joinedAt: v.string(),
    status: v.string(), // "active", "graduated", "paused"
  }).index("by_student", ["studentId"]).index("by_class", ["classId"]),

  // Daily Tracking Logs
  dailyProgress: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    teacherId: v.id("users"),
    date: v.string(),
    // The specific assignment
    surahName: v.string(),
    ayahStart: v.number(),
    ayahEnd: v.number(),
    // Performance
    rating: v.number(), // 1-5 (or specific Tajweed score)
    notes: v.optional(v.string()),
    mistakes: v.array(v.object({ ayah: v.number(), type: v.string() })), // e.g. "Harkat", "Makhraj"
    status: v.string(), // "Passed", "Needs Review", "Failed"
  }).index("by_student_date", ["studentId", "date"]),
});
```

---

## 🚀 Key Features by User Journey

### 👤 Student Experience: "The Seeker's Dashboard"
*   **Goal:** Motivation & Clarity.
*   **Hero Section:** "Prophetic Streak" – Shows days studied in a row with a hadith about seeking knowledge.
*   **The Assignment:** A clear, big card showing exactly what to review for tomorrow (e.g., "Surah Al-Mulk: Ayah 1-10").
*   **Leaderboard:** Friendly competition within their specific Halaqa (optional, privacy-focused).

### 👨‍🏫 Teacher Experience: "The Muallim's Cockpit"
*   **Goal:** Efficiency.
*   **Rapid Grader:** A keyboard-first interface.
    *   Press `Space` to log a mistake while listening.
    *   Press `Enter` to pass.
*   **Attendance Grid:** One-click attendance for the whole class.
*   **Student Insight:** Before the student starts reciting, show the teacher: "Ahmed struggled with Ayah 5 yesterday."

---

## � Suggested Tech Stack Extensions

| Feature | Library/Tool | Usage |
| :--- | :--- | :--- |
| **Icons** | `pro-icons` or `lucide-react` | Use thin, elegant strokes. |
| **Charts** | `recharts` | Visualizing Hifz progress over time. |
| **Dates** | `date-fns` | Handling Hijri/Gregorian integration. |
| **Animations** | `framer-motion` | Page transitions, modal reveals, streak celebrations. |
| **Video** | `LiveKit` | Best-in-class Webrtc for the actual class sessions. |

---

## � Immediate Action Plan

To "wow" the user immediately, we should build the **Student Dashboard (Home)** first.

1.  **Layout**: Create the "Noor" Shell (Sidebar + Glass Navbar).
2.  **Hero**: Implement the "Streak" Visualization using a radial progress chart.
3.  **Recent Activity**: A list of the latest graded sessions from the database.