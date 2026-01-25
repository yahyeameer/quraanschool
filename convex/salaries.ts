import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// --- Queries ---

export const getSalaries = query({
    args: {
        month: v.string(),
        status: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("salaries").withIndex("by_month", (q) => q.eq("month", args.month));

        if (args.status) {
            q = q.filter((q) => q.eq(q.field("status"), args.status));
        }

        const salaries = await q.collect();

        // Enrich with staff details
        const enriched = await Promise.all(salaries.map(async (salary) => {
            const staff = await ctx.db.get(salary.staffId);
            return {
                ...salary,
                staffName: staff?.name || "Unknown",
                staffRole: staff?.role || "Staff"
            };
        }));

        return enriched;
    },
});

export const getContracts = query({
    args: {},
    handler: async (ctx) => {
        const contracts = await ctx.db.query("staff_contracts").collect();
        const enriched = await Promise.all(contracts.map(async (c) => {
            const staff = await ctx.db.get(c.staffId);
            return {
                ...c,
                staffName: staff?.name || "Unknown",
            };
        }));
        return enriched;
    }
});

export const getAdjustments = query({
    args: { staffId: v.id("users"), month: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("payroll_adjustments")
            .withIndex("by_staff_month", (q) => q.eq("staffId", args.staffId).eq("month", args.month))
            .collect();
    }
});

// --- Mutations ---

export const createContract = mutation({
    args: {
        staffId: v.id("users"),
        baseSalary: v.number(),
        currency: v.string(),
        startDate: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if contract exists
        const existing = await ctx.db.query("staff_contracts")
            .withIndex("by_staff", q => q.eq("staffId", args.staffId))
            .first();

        if (existing) {
            // Update existing
            await ctx.db.patch(existing._id, {
                baseSalary: args.baseSalary,
                currency: args.currency,
                startDate: args.startDate,
                type: args.type,
                status: "Active"
            });
        } else {
            await ctx.db.insert("staff_contracts", {
                ...args,
                status: "Active"
            });
        }
    },
});

export const addAdjustment = mutation({
    args: {
        staffId: v.id("users"),
        month: v.string(),
        type: v.string(),
        amount: v.number(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("payroll_adjustments", args);
        // If salary record exists for this month, we might need to update it or mark it as needing recalculation
        // For simplicity, we'll let the "generate" function handle this, or user can re-generate.
    },
});

export const generateMonthlyPayroll = mutation({
    args: { month: v.string() }, // e.g. "2026-02"
    handler: async (ctx, args) => {
        const contracts = await ctx.db.query("staff_contracts").collect();

        const results = [];

        for (const contract of contracts) {
            if (contract.status !== "Active") continue;

            // Get Adjustments
            const adjustments = await ctx.db.query("payroll_adjustments")
                .withIndex("by_staff_month", q => q.eq("staffId", contract.staffId).eq("month", args.month))
                .collect();

            const totalAdjustments = adjustments.reduce((acc, curr) => {
                return curr.type === "Bonus" || curr.type === "Reimbursement"
                    ? acc + curr.amount
                    : acc - curr.amount;
            }, 0);

            const totalAmount = contract.baseSalary + totalAdjustments;

            // Check if already generated
            const existing = await ctx.db.query("salaries")
                .withIndex("by_month", q => q.eq("month", args.month))
                .filter(q => q.eq(q.field("staffId"), contract.staffId))
                .first();

            if (existing) {
                if (existing.status === "draft") {
                    await ctx.db.patch(existing._id, {
                        baseAmount: contract.baseSalary,
                        adjustments: totalAdjustments,
                        totalAmount: totalAmount,
                        generatedAt: new Date().toISOString()
                    });
                }
            } else {
                await ctx.db.insert("salaries", {
                    staffId: contract.staffId,
                    baseAmount: contract.baseSalary,
                    adjustments: totalAdjustments,
                    totalAmount: totalAmount,
                    month: args.month,
                    status: "draft",
                    generatedAt: new Date().toISOString()
                });
            }
            results.push(contract.staffId);
        }
        return results.length;
    },
});

export const approveSalary = mutation({
    args: { salaryId: v.id("salaries") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.salaryId, { status: "approved" });
    }
});

export const markAsPaid = mutation({
    args: { salaryId: v.id("salaries"), paymentDate: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.salaryId, { status: "paid", paymentDate: args.paymentDate });
    }
});
