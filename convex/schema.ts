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
    mistakes: v.optional(v.array(v.object({ ayah: v.number(), type: v.string() }))), // e.g. "Harkat", "Makhraj"
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
});
