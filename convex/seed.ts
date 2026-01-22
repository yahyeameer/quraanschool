import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Helper to get random item from array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random date within last 30 days
const randomDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const seed = internalMutation({
    args: {},
    handler: async (ctx) => {
        // 1. Clear existing test data? No, let's just append or check.
        // For safety, we won't delete unless requested. 
        // But to avoid duplicates if run multiple times, we could check counts.
        const existingUsers = await ctx.db.query("users").collect();
        if (existingUsers.length > 50) {
            console.log("Database already seems populated. Skipping seed.");
            return "Skipped: Database already populated";
        }

        console.log("Starting seed...");

        // 2. Create Teachers (5)
        const teacherIds = [];
        for (let i = 1; i <= 5; i++) {
            const id = await ctx.db.insert("users", {
                clerkId: `teacher_test_${i}`,
                name: `Teacher ${i} Al-Siddiq`,
                email: `teacher${i}@example.com`,
                role: "teacher",
                phone: `+1555000${i}`,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=teacher${i}`,
            });
            teacherIds.push(id);
        }
        console.log(`Created ${teacherIds.length} teachers`);

        // 3. Create Parents (10)
        const parentIds = [];
        for (let i = 1; i <= 10; i++) {
            const id = await ctx.db.insert("users", {
                clerkId: `parent_test_${i}`,
                name: `Parent ${i} Family`,
                email: `parent${i}@example.com`,
                role: "parent",
                phone: `+1555999${i}`,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=parent${i}`,
            });
            parentIds.push(id);
        }
        console.log(`Created ${parentIds.length} parents`);

        // 4. Create Classes (Linked to Teachers)
        const classIds = [];
        const subjects = ["Hifz", "Tajweed", "Nazra", "Islamic Studies"];
        for (const teacherId of teacherIds) {
            const id = await ctx.db.insert("classes", {
                name: `Halaqa Group ${random(["A", "B", "C"])}`,
                teacherId,
                category: "Quran",
                subject: random(subjects),
                schedule: [{ day: "Mon", time: "16:00" }, { day: "Wed", time: "16:00" }],
                description: "Focus on memorization and proper pronunciation.",
            });
            classIds.push(id);
        }
        console.log(`Created ${classIds.length} classes`);

        // 5. Create Students (20)
        const studentIds = [];
        for (let i = 1; i <= 20; i++) {
            const parentId = random(parentIds);
            const studentId = await ctx.db.insert("users", {
                clerkId: `student_test_${i}`,
                name: `Student ${i} bin Parent`,
                email: `student${i}@example.com`,
                role: "student",
                parentId,
                phone: `+1555888${i}`,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
                streak: Math.floor(Math.random() * 20),
            });
            studentIds.push(studentId);

            // Enroll in a random class
            const classId = random(classIds);
            await ctx.db.insert("enrollments", {
                studentId,
                classId,
                joinedAt: new Date().toISOString(),
                status: "active",
            });

            // Generate Progress Logs
            for (let j = 0; j < 5; j++) {
                await ctx.db.insert("dailyProgress", {
                    studentId,
                    classId,
                    teacherId: random(teacherIds), // Ideally the class teacher, but random is okay for seed
                    date: randomDate(),
                    surahName: random(["Al-Fatiha", "Al-Baqarah", "Yasin", "Al-Mulk"]),
                    ayahStart: 1,
                    ayahEnd: 10,
                    rating: Math.floor(Math.random() * 5) + 1,
                    status: random(["Passed", "Needs Review"]),
                });
            }

            // Generate Payments
            await ctx.db.insert("payments", {
                studentId,
                amount: 50,
                month: "January 2026",
                date: randomDate(),
                status: random(["paid", "pending"]),
            });
        }
        console.log(`Created ${studentIds.length} students with progress and payments`);

        // 6. Generate Expenses
        const categories = ["salary", "maintenance", "utility", "other"];
        for (let i = 0; i < 10; i++) {
            await ctx.db.insert("expenses", {
                title: `Expense Item ${i}`,
                amount: Math.floor(Math.random() * 100) + 20,
                category: random(categories),
                date: randomDate(),
                description: "Generated test expense",
                recordedBy: teacherIds[0], // Assign to a teacher/admin
            });
        }

        return "Seeding Complete!";
    },
});
