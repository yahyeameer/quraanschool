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
    parentId: v.optional(v.id("users")), // For students
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_parent", ["parentId"]),

  // Group/Class Management
  classes: defineTable({
    name: v.string(),
    teacherId: v.id("users"),
    schedule: v.array(v.object({ day: v.string(), time: v.string() })),
    category: v.string(), // "Hifz", "Nazra", "Tajweed" -> Can be legacy or specific to Quran
    subject: v.optional(v.string()), // "Quran", "Fiqh", "Seerah", "Arabic", "Math"
    description: v.optional(v.string()),
  }),

  // Connecting Students to Classes
  enrollments: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    joinedAt: v.string(),
    status: v.string(), // "active", "graduated", "paused"
  }).index("by_student", ["studentId"]).index("by_class", ["classId"]),

  // Daily Tracking Logs (Generalized)
  dailyProgress: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    teacherId: v.id("users"),
    date: v.string(),

    // Quran Specific (Optional now)
    surahName: v.optional(v.string()),
    ayahStart: v.optional(v.number()),
    ayahEnd: v.optional(v.number()),

    // General Academic (New)
    topic: v.optional(v.string()), // e.g. "Chapter 4: Biographies"
    score: v.optional(v.number()), // e.g. 85 or 5 (stars)

    // Performance
    rating: v.number(), // 1-5 (Universal rating)
    notes: v.optional(v.string()),
    mistakes: v.optional(v.array(v.object({ ayah: v.number(), type: v.string() }))),
    status: v.string(), // "Passed", "Needs Review", "Failed"
  }).index("by_student_date", ["studentId", "date"]),

  // Tasks (Sample - can keep or remove)
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  // Self-Service Tracker Logs
  tracker_logs: defineTable({
    studentId: v.id("users"),
    date: v.string(),
    surahName: v.string(),
    ayahStart: v.number(),
    ayahEnd: v.number(),
    rating: v.number(),
    notes: v.optional(v.string()),
    type: v.string(), // "hifz" | "review"
  }).index("by_student", ["studentId"]),

  // Class Assignments
  assignments: defineTable({
    classId: v.id("classes"),
    teacherId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.string(),
    status: v.string(), // "active" | "archived"
  }).index("by_class", ["classId"]),

  // Attendance
  attendance: defineTable({
    studentId: v.id("users"),
    classId: v.id("classes"),
    date: v.string(), // YYYY-MM-DD
    status: v.string(), // "present" | "absent" | "late"
  }).index("by_class_date", ["classId", "date"]),

  // Payments
  payments: defineTable({
    studentId: v.id("users"),
    amount: v.number(),
    month: v.string(), // "January 2026"
    date: v.string(), // Transaction date
    status: v.string(), // "paid" | "pending"
  }).index("by_student", ["studentId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "info" | "success" | "warning" | "error"
    isRead: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  // New Enrollments / Leads
  registrations: defineTable({
    parentName: v.string(),
    email: v.string(),
    phone: v.string(),
    studentName: v.string(),
    age: v.number(),
    plan: v.string(), // "Foundation", "Hifz", "Academy"
    status: v.string(), // "new", "contacted", "enrolled", "archived"
    notes: v.optional(v.string()),
    submittedAt: v.string(),
  }).index("by_status", ["status"]),
});
