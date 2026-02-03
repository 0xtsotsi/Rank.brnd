'use client';

/**
 * Calendar Demo Page
 * Demonstrates the 30-day calendar view with drag-drop scheduling
 */

import { useState, useCallback } from 'react';
import { CalendarView, EventDialog } from '@/components/calendar';
import type { CalendarEvent, EventStatus } from '@/types/calendar';
import { Plus } from 'lucide-react';

// Generate sample events for demonstration
function generateSampleEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = new Date();
  const statuses: EventStatus[] = [
    'pending',
    'in-progress',
    'completed',
    'cancelled',
    'overdue',
  ];
  const titles = [
    'Team Standup',
    'Code Review',
    'Deploy to Production',
    'Client Meeting',
    'Sprint Planning',
    'Bug Fix Session',
    'Documentation Update',
    'Performance Review',
    'Design Review',
    'Quarterly Planning',
  ];

  // Generate events spread across 30 days
  for (let i = -5; i < 25; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Add 1-3 events per day
    const eventsPerDay = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < eventsPerDay; j++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];

      events.push({
        id: `event-${events.length}`,
        title: `${title} ${j + 1}`,
        description: `Description for ${title}`,
        date,
        status,
        duration: Math.floor(Math.random() * 90) + 15, // 15-105 minutes
      });
    }
  }

  return events;
}

export default function CalendarDemoPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handle event click
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  }, []);

  // Handle day click
  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    // In a real app, this would open a "create event" dialog
    alert(
      `Clicked on: ${date.toLocaleDateString()}\nIn production, this would open a create event dialog.`
    );
  }, []);

  // Handle event drop
  const handleEventDrop = useCallback((eventId: string, newDate: Date) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, date: newDate } : event
      )
    );
    console.log(`Moved event ${eventId} to ${newDate.toLocaleDateString()}`);
  }, []);

  // Handle event delete
  const handleEventDelete = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  // Handle event edit (placeholder)
  const handleEventEdit = useCallback((event: CalendarEvent) => {
    alert(
      `Edit event: ${event.title}\nIn production, this would open an edit form.`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Calendar Demo
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                A 30-day calendar view with drag-drop scheduling capability
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4" />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6">
          <CalendarView
            events={events}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
            onEventDrop={handleEventDrop}
            numberOfDays={30}
            firstDayOfWeek={0}
            showWeekends={true}
          />
        </div>

        {/* Feature Description */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <svg
                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              30-Day View
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See a full month of events at a glance with responsive grid
              layout.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Drag & Drop
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easily reschedule events by dragging them to a different day.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <svg
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Color-Coded Status
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visual status indicators for pending, in-progress, completed,
              cancelled, and overdue.
            </p>
          </div>
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />
    </div>
  );
}
