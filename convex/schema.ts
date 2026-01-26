import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define role enum for type safety
const UserRole = v.union(
  v.literal("admin"),
  v.literal("manager"),
  v.literal("teacher"),
  v.literal("staff"),
  v.literal("accountant"),
  v.literal("librarian"),
  v.literal("receptionist"),
  v.literal("parent"),
  v.literal("student"),
  v.literal("guest")
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()), // Email might be optional if using phone
    phone: v.optional(v.string()), // Added phone
    role: UserRole,
    avatarUrl: v.optional(v.string()),
    streak: v.optional(v.number()), // Gamification
    parentId: v.optional(v.id("users")), // For students
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_parent", ["parentId"])
    .index("by_role", ["role"])
    .index("by_phone", ["phone"]), // Added phone index

  // Group/Class Management
  classes: defineTable({
    name: v.string(),
    teacherId: v.id("users"),
    schedule: v.array(v.object({ day: v.string(), time: v.string() })),
    category: v.string(), // "Hifz", "Nazra", "Tajweed" -> Can be legacy or specific to Quran
    subject: v.optional(v.string()), // "Quran", "Fiqh", "Seerah", "Arabic", "Math"
    description: v.optional(v.string()),
  })
    .index("by_teacher", ["teacherId"]), // Add teacher index for performance

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
  })
    .index("by_class_date", ["classId", "date"])
    .index("by_student", ["studentId"])
    .index("by_date", ["date"]),

  // Payments
  payments: defineTable({
    studentId: v.id("users"),
    amount: v.number(),
    month: v.string(), // "January 2026"
    date: v.string(), // Transaction date
    status: v.string(), // "paid" | "pending"
  })
    .index("by_student", ["studentId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

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

  invitations: defineTable({
    email: v.optional(v.string()),
    phone: v.optional(v.string()), // Added phone
    role: v.string(), // "teacher" | "staff"
    status: v.string(), // "pending" | "accepted"
    invitedAt: v.string(),
    name: v.optional(v.string()), // For staff/teacher invitations
    studentName: v.optional(v.string()), // Legacy/Student specific
    studentId: v.optional(v.id("users")), // Link to pre-created student user
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]), // Added phone index

  // Staff Contracts (Base Salary)
  staff_contracts: defineTable({
    staffId: v.id("users"),
    baseSalary: v.number(),
    currency: v.string(), // "USD", "KES", etc.
    startDate: v.string(),
    type: v.string(), // "Full-time", "Part-time", "Contract"
    status: v.string(), // "Active", "Terminated"
  }).index("by_staff", ["staffId"]),

  // Payroll Adjustments (Bonuses/Deductions)
  payroll_adjustments: defineTable({
    staffId: v.id("users"),
    month: v.string(),
    type: v.string(), // "Bonus", "Deduction", "Reimbursement"
    amount: v.number(),
    description: v.string(),
  }).index("by_staff_month", ["staffId", "month"]),

  // Staff Salary Records (Generated Monthly)
  salaries: defineTable({
    staffId: v.id("users"),
    baseAmount: v.number(),
    adjustments: v.number(), // Net +/-
    totalAmount: v.number(),
    month: v.string(), // e.g. "February 2026"
    status: v.string(), // "draft", "approved", "paid"
    paymentDate: v.optional(v.string()),
    generatedAt: v.string(),
  })
    .index("by_staff", ["staffId"])
    .index("by_month", ["month"])
    .index("by_status", ["status"]),

  // Exams
  exams: defineTable({
    classId: v.id("classes"),
    subject: v.string(), // "Quran", "Tajweed", etc.
    date: v.string(),
    totalMarks: v.number(),
    title: v.string(), // "Midterm", "Final", "Quiz 1"
    description: v.optional(v.string()),
    status: v.string(), // "scheduled", "completed", "released"
  }).index("by_class", ["classId"]),

  // Exam Results
  exam_results: defineTable({
    examId: v.id("exams"),
    studentId: v.id("users"),
    marksObtained: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_exam", ["examId"])
    .index("by_student", ["studentId"]),

  // Messages    // Communication
  messages: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    subject: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.string(),
    type: v.string(), // "direct", "announcement", "class_notice"
    classId: v.optional(v.id("classes")),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_sender", ["senderId"]),

  // Gamification
  student_stats: defineTable({
    studentId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastLoginDate: v.string(),
    totalAyahs: v.number(),
    points: v.number(),
    level: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_points", ["points"]),

  achievements: defineTable({
    studentId: v.id("users"),
    type: v.string(), // "badge", "milestone"
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    earnedAt: v.string(),
  })
    .index("by_student", ["studentId"]),

  // Fee structures for billing
  fee_structures: defineTable({
    studentId: v.id("users"),
    monthlyAmount: v.number(),
    discount: v.optional(v.number()),
    dueDay: v.number(), // day of month (1-28)
    status: v.string(), // "active", "paused"
    notes: v.optional(v.string()),
  })
    .index("by_student", ["studentId"])
    .index("by_status", ["status"]),

  // Expenses
  expenses: defineTable({
    title: v.string(),
    amount: v.number(),
    category: v.string(), // "salary", "maintenance", "utility", "other"
    date: v.string(),
    description: v.optional(v.string()),
    recordedBy: v.id("users"),
  })
    .index("by_date", ["date"])
    .index("by_category", ["category"]),

  // Library System
  books: defineTable({
    title: v.string(),
    author: v.string(),
    isbn: v.optional(v.string()), // International Standard Book Number
    category: v.string(), // "Fiction", "History", "Islamic Studies", "Reference"
    copiesAvailable: v.number(),
    copiesTotal: v.number(),
    coverUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    addedBy: v.optional(v.id("users")),
    location: v.optional(v.string()), // Shelf/Aisle
  })
    .index("by_category", ["category"])
    .index("by_title", ["title"])
    .searchIndex("search_books", {
      searchField: "title",
      filterFields: ["category", "author"],
    }),

  loans: defineTable({
    bookId: v.id("books"),
    userId: v.id("users"), // Student or Staff
    borrowDate: v.string(),
    dueDate: v.string(),
    returnDate: v.optional(v.string()),
    status: v.string(), // "active", "returned", "overdue", "lost"
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_status", ["status"]),

  // Transport System
  transport_routes: defineTable({
    name: v.string(), // "Route 1 - Downtown"
    driverId: v.optional(v.id("users")),
    vehiclePlate: v.optional(v.string()),
    capacity: v.number(),
    status: v.string(), // "garage", "en-route", "completed", "maintenance"
    currentLocation: v.optional(v.object({ lat: v.number(), lng: v.number() })),
    lastUpdated: v.optional(v.string())
  })
    .index("by_driver", ["driverId"])
    .index("by_status", ["status"]),

  transport_stops: defineTable({
    routeId: v.id("transport_routes"),
    name: v.string(), // "Main St & 5th Ave"
    order: v.number(),
    expectedTime: v.string(), // "07:30"
  })
    .index("by_route", ["routeId"]),

  transport_assignments: defineTable({
    studentId: v.id("users"),
    routeId: v.id("transport_routes"),
    stopId: v.optional(v.id("transport_stops")),
    type: v.string(), // "pickup", "dropoff", "both"
  })
    .index("by_student", ["studentId"])
    .index("by_route", ["routeId"]),

  // New Academic Management
  subjects: defineTable({
    name: v.string(), // e.g., "Quran", "Arabic", "Fiqh"
    code: v.string(), // e.g., "QUR101"
    category: v.string(), // "Hifz", "Academic", "Language"
    description: v.optional(v.string()),
    teacherId: v.optional(v.id("users")), // Primary teacher if applicable
  }).index("by_category", ["category"]),

  course_of_study: defineTable({
    subjectId: v.id("subjects"),
    title: v.string(), // e.g., "Level 1: Foundation"
    level: v.string(),
    description: v.optional(v.string()),
    books: v.array(v.object({
      title: v.string(),
      author: v.optional(v.string()),
      link: v.optional(v.string()), // PDF or external link
    })),
    topics: v.array(v.string()), // Key topics covered
  }).index("by_subject", ["subjectId"]),
});
