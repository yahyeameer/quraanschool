"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Calculate range for query
    // We need start of first week and end of last week to fill calendar grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const events = useQuery(api.calendar.getEvents, {
        start: startDate.getTime(),
        end: endDate.getTime(),
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getDayEvents = (day: Date) => {
        if (!events) return [];
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground py-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {days.map((day, dayIdx) => {
                        const dayEvents = getDayEvents(day);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "border-r border-b p-2 relative transition-colors hover:bg-muted/30",
                                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                    isToday(day) && "bg-primary/5"
                                )}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className={cn(
                                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                                    isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
                                )}>
                                    {format(day, "d")}
                                </div>

                                {/* Events List (Truncated) */}
                                <div className="space-y-1 overflow-hidden max-h-[80px]">
                                    {dayEvents.slice(0, 3).map((event: any) => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "text-[10px] truncate px-1.5 py-0.5 rounded cursor-pointer border-l-2",
                                                event.type === "exam"
                                                    ? "bg-red-500/10 text-red-500 border-red-500"
                                                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500"
                                            )}
                                            title={event.title}
                                        >
                                            {format(new Date(event.start), "HH:mm")} {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-muted-foreground pl-1">
                                            + {dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Details Dialog (triggered via state or click, simplified here) */}
            {selectedDate && (
                <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {getDayEvents(selectedDate).length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No events scheduled.</p>
                            ) : (
                                <div className="space-y-3">
                                    {getDayEvents(selectedDate).map((event: any) => (
                                        <div key={event.id} className="flex gap-4 p-3 rounded-lg border bg-muted/30">
                                            <div className={cn(
                                                "w-1 shrink-0 rounded-full",
                                                event.type === "exam" ? "bg-red-500" : "bg-emerald-500"
                                            )} />
                                            <div>
                                                <h4 className="font-semibold text-sm">{event.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
