"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";

export default function EnrollPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultPlan = searchParams.get("plan") || "Foundation";

    const submitRegistration = useMutation(api.registrations.submit);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        parentName: "",
        email: "",
        phone: "",
        studentName: "",
        age: "",
        plan: defaultPlan
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (val: string) => {
        setFormData({ ...formData, plan: val });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await submitRegistration({
                parentName: formData.parentName,
                email: formData.email,
                phone: formData.phone,
                studentName: formData.studentName,
                age: Number(formData.age),
                plan: formData.plan
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-emerald-500/30 text-white shadow-2xl">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold font-amiri">Application Received!</h2>
                        <p className="text-emerald-100/80">
                            JazakAllah Khair! We have received your interest for the <span className="text-white font-semibold">{formData.plan}</span>.
                        </p>
                        <p className="text-emerald-100/80 text-sm">
                            Our admissions team will contact you at <strong>{formData.phone}</strong> shortly to finalize the process.
                        </p>
                        <div className="pt-4">
                            <Link href="/">
                                <Button variant="outline" className="border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-100">
                                    Return Home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),rgba(0,0,0,0))] pointer-events-none" />

            <Link href="/#pricing" className="absolute top-8 left-8 text-emerald-200/50 hover:text-white transition-colors z-20 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-amiri font-bold text-white mb-2">Waitlist Enrollment</h1>
                    <p className="text-emerald-200/70">Join the Khalaf Al Cudul family today.</p>
                </div>

                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white">Student Details</CardTitle>
                        <CardDescription className="text-emerald-200/60">
                            Please provide accurate contact information.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 text-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="parentName">Parent Name</Label>
                                    <Input
                                        id="parentName"
                                        name="parentName"
                                        placeholder="e.g. Ahmed Ali"
                                        required
                                        className="bg-black/20 border-white/10 focus:border-emerald-500 text-white placeholder:text-emerald-200/20"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="+252..."
                                        required
                                        className="bg-black/20 border-white/10 focus:border-emerald-500 text-white placeholder:text-emerald-200/20"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="contact@example.com"
                                    required
                                    className="bg-black/20 border-white/10 focus:border-emerald-500 text-white placeholder:text-emerald-200/20"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="studentName">Child's Name</Label>
                                    <Input
                                        id="studentName"
                                        name="studentName"
                                        placeholder="Full Name"
                                        required
                                        className="bg-black/20 border-white/10 focus:border-emerald-500 text-white placeholder:text-emerald-200/20"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        placeholder="5-18"
                                        required
                                        min="4"
                                        max="19"
                                        className="bg-black/20 border-white/10 focus:border-emerald-500 text-white placeholder:text-emerald-200/20"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plan">Interested Program</Label>
                                <Select value={formData.plan} onValueChange={handleSelectChange}>
                                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                        <SelectValue placeholder="Select Program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Foundation">Foundation (KG - Gr 3)</SelectItem>
                                        <SelectItem value="Hifz Intensive">Hifz Intensive</SelectItem>
                                        <SelectItem value="Khalaf Academy (Full Time)">Khalaf Academy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 text-lg" // Solid color better for form submit
                                disabled={isLoading}
                            >
                                {isLoading ? "Submitting..." : "Submit Application"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
