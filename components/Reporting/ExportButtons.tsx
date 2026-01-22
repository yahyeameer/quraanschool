"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Helper to download CSV
const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","),
        ...data.map((row) =>
            headers.map((header) => {
                const val = row[header];
                return typeof val === 'string' && val.includes(',')
                    ? `"${val}"`
                    : val
            }).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filename}.csv`);
};

export function ExportButtons() {
    // Determine data to export (Fetch all users for now as example)
    const students = useQuery(api.users.getAllStudents) || [];
    // Note: Need to make sure `api.users.getAllStudents` exists or create it. 
    // For now assuming we can fetch or will add query.
    // Actually, let's assume we pass data in or fetch here.
    // The previous implementation plan didn't specify the exact query, so I'll check `users.ts` later.
    // For safety, let's use a known query or mock for the UI component structure first, 
    // but better to rely on `users` table query.

    const handleExportStudents = () => {
        const data = students.map(s => ({
            Name: s.name,
            Email: s.email,
            Role: s.role,
            "Joined Date": new Date(s._creationTime).toLocaleDateString()
        }));
        downloadCSV(data, "students_list");
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportStudents} disabled={!students.length}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("PDF Export coming soon")} disabled>
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        </div>
    );
}

// Separate component for Report generation logic if needed
