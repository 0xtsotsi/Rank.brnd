/**
 * Calendar Utilities
 * 
 * Helper functions for calendar operations,
 * date manipulation, and scheduling logic.
 */

import { format, startOfDay, endOfDay, isWithinInterval, isSameMonth, isSameDay, isBefore, isAfter, addDays, differenceInDays, parseISO, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export interface CalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number;
}

export interface ScheduleOptions {
  articleId: string;
  scheduledAt: Date | string;
  productId: string;
}

export interface SchedulingResult {
  success: boolean;
  error?: string;
  scheduledAt?: string;
  conflicts?: Array<{ id: string; title: string; scheduledAt: string }>;
}

export interface ScheduleConflict {
  existingEvent: {
    id: string;
    title: string;
    scheduledAt: string;
  };
  newEvent: {
    scheduledAt: string;
  };
}

export interface DropZone {
  date: Date;
  productId: string;
}

export interface RecurringScheduleOptions {
  startDate: Date;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  count?: number;
}

export interface RecurringSchedule {
  dates: Date[];
  title: string;
  frequency: string;
  interval: number;
}

export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) {
    return '';
  }

  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export function hasDateConflict(
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date
): boolean {
  return (
    (isWithinInterval(startDate1, { start: startDate2, end: endDate2 }) ||
     isWithinInterval(endDate1, { start: startDate2, end: endDate2 })) ||
    (isWithinInterval(startDate2, { start: startDate1, end: endDate1 })) ||
     isWithinInterval(endDate2, { start: startDate1, end: endDate1 }))
  );
}

export function calculateDurationMinutes(startDate: Date, endDate: Date): number {
  const diff = differenceInMinutes(endDate, startDate);
  return diff;
}

export function formatDuration(startDate: Date, endDate: Date): string {
  const minutes = calculateDurationMinutes(startDate, endDate);
  const hours = Math.floor(minutes / (60 * 24));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % (60 * 24);
    if (remainingHours > 0 && remainingMinutes > 0) {
      return `${days}d ${remainingHours}h ${remainingMinutes}m`;
    } else if (remainingHours > 0) {
      return `${days}d ${remainingHours}h`;
    } else {
      return `${days}d`;
    }
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    return `${minutes}m`;
  }
}

export function generateTimeSlots(
  date: Date,
  intervalMinutes: number = 30,
  startHour: number = 6,
  endHour: number = 18
): Array<{ time: Date; label: string }> {
  const slots: Array<{ time: Date; label: string }> = [];
  const day = startOfDay(date);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = new Date(day);
      time.setHours(hour, minute, 0, 0);
      slots.push({
        time,
        label: format(time, 'h:mm a'),
      });
    }
  }

  return slots;
}

export function isPastDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && isBefore(d, startOfDay(new Date()));
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && isSameDay(d, new Date());
}

export function isFutureDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && isAfter(d, endOfDay(new Date()));
}

export function getDaysBetween(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const current = startOfDay(startDate);
  const end = endOfDay(endDate);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export async function scheduleArticle(options: ScheduleOptions): Promise<SchedulingResult> {
  const scheduledAt = typeof options.scheduledAt === 'string'
    ? parseISO(options.scheduledAt)
    : options.scheduledAt;

  if (!isValid(scheduledAt)) {
    return {
      success: false,
      error: 'Invalid scheduled date',
    };
  }

  if (isPastDate(scheduledAt)) {
    return {
      success: false,
      error: 'Cannot schedule in past',
    };
  }

  const conflicts: any[] = [];

  if (conflicts.length > 0) {
    return {
      success: false,
      conflicts,
    };
  }

  return {
    success: true,
    scheduledAt: format(scheduledAt, "yyyy-MM-dd'T'HH:mm:ss.SSS'x"),
  };
}

export function isTimeSlotAvailable(
  date: Date,
  startTime: string,
  duration: number
): boolean {
  const [hours, minutes] = startTime.split(':').map(Number);
  const slotStart = new Date(date);
  slotStart.setHours(hours, minutes, 0, 0);

  const slotEnd = addMinutes(slotStart, duration);

  const businessStart = new Date(date);
  businessStart.setHours(6, 0, 0, 0);

  const businessEnd = new Date(date);
  businessEnd.setHours(18, 0, 0, 0);

  return isWithinInterval(slotStart, { start: businessStart, end: businessEnd }) &&
         isWithinInterval(slotEnd, { start: businessStart, end: businessEnd });
}

export function generateRecurringSchedule(options: RecurringScheduleOptions): RecurringSchedule {
  const { startDate, frequency, interval, count } = options;
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; count ? i < count : i < 52; i++) {
    dates.push(new Date(currentDate));

    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (interval * 7));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
    }
  }

  return {
    dates,
    title: `${frequency} every ${interval} ${interval === 1 ? '' : 'weeks/months'}`,
    frequency,
    interval,
  };
}

export function generateDayCells(
  startDate: Date,
  endDate?: Date
): CalendarDayCell[] {
  const end = endDate || endOfMonth(startDate);
  const start = startOfMonth(startDate);
  const days = eachDayOfInterval({ start: days, end: end });

  return days.map((date) => {
    const now = new Date();
    const d = typeof date === 'string' ? parseISO(date) : date;

    return {
      date: d,
      isCurrentMonth: isSameMonth(d, now),
      isToday: isSameDay(d, now),
      dayOfWeek: d.getDay(),
    };
  });
}

export function getDefaultStartDate(): Date {
  return startOfMonth(new Date());
}

export function formatCellDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  if (format === 'short') {
    return format(d, 'd');
  }
  return format(d, 'MMM d, yyyy');
}

export function getDayOfWeek(date: Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d.getDay();
}

export function sortEventsByPriority<T extends { priority?: string }>(events: T[]): T[] {
  const priorityOrder: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...events].sort((a, b) => {
    const priorityA = priorityOrder[a.priority || 'medium'] || 2;
    const priorityB = priorityOrder[b.priority || 'medium'] || 2;

    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    return 0;
  });
}
