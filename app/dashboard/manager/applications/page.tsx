"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Phone, Mail, CheckCircle, Archive } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function ApplicationsPage() {
    const applications = useQuery(api.registrations.get);
    const updateStatus = useMutation(api.registrations.updateStatus);

    const handleStatusUpdate = async (id: Id<"registrations">, status: string) => {
        try {
            await updateStatus({ id, status });
            toast.success(`Application marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (applications === undefined) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Applications</h1>
                    <p className="text-muted-foreground">Manage incoming enrollments and waitlist requests.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>A list of all submitted enrollment forms from the landing page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Parent Info</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No applications found.
                                    </TableCell>
                                </TableRow>
                            ) : applications.map((app) => (
                                <TableRow key={app._id}>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(app.submittedAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{app.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{app.age} years old</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">{app.parentName}</span>
                                            <a href={`tel:${app.phone}`} className="flex items-center text-xs text-blue-600 hover:underline gap-1">
                                                <Phone className="h-3 w-3" /> {app.phone}
                                            </a>
                                            <a href={`mailto:${app.email}`} className="flex items-center text-xs text-muted-foreground hover:underline gap-1">
                                                <Mail className="h-3 w-3" /> {app.email}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {app.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            app.status === "new" ? "bg-blue-500" :
                                                app.status === "contacted" ? "bg-amber-500" :
                                                    app.status === "enrolled" ? "bg-green-600" : "bg-gray-500"
                                        }>
                                            {app.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {app.status === "new" && (
                                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(app._id, "contacted")}>
                                                    Mark Contacted
                                                </Button>
                                            )}
                                            {app.status === "contacted" && (
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatusUpdate(app._id, "enrolled")}>
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Enroll
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(app._id, "archived")}>
                                                <Archive className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
