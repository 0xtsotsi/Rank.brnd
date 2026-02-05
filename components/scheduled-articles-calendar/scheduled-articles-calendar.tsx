/**
 * Scheduled Articles Calendar Component
 * 
 * 30-day calendar view for scheduling article publishing
 * Features drag-drop scheduling, conflict detection, and status tracking
 */

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isValid } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useCalendarDragDrop } from '@/lib/hooks/use-calendar-drag-drop';

interface ScheduledArticle {
  id: string;
  title: string;
  slug: string;
  scheduledAt: string;
  status: 'scheduled' | 'queued' | 'published' | 'failed';
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  articles: ScheduledArticle[];
}

export function ScheduledArticlesCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [articles, setArticles] = useState<ScheduledArticle[]>([]);

  const {
    draggedEvent,
    isDragging,
    conflicts,
    handleDragStart,
    handleDragEnd,
    handleDrop: dropHandler,
    resolveConflict,
  } = useCalendarDragDrop('product-1'); // TODO: Use actual product ID

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map((date) => {
      const isCurrentMonth = isSameMonth(date, currentDate);
      const dayArticles = articles.filter((article) => {
        const articleDate = parseISO(article.scheduledAt);
        return isValid(articleDate) && isSameDay(articleDate, date);
      });

      return {
        date,
        isCurrentMonth,
        articles: dayArticles,
      } as CalendarDay;
    });
  }, [currentDate, articles]);

  const handleDayDrop = async (event: React.DragEvent, day: CalendarDay) => {
    event.preventDefault();

    if (!draggedEvent) {
      return;
    }

    // Update article scheduled date
    // This would call an API to update the schedule
    const newScheduledAt = format(day.date, 'yyyy-MM-dd');
    // await api.articles.updateSchedule(draggedEvent.id, { scheduledAt: newScheduledAt });

    // Update local state optimistically
    setArticles((prev) =>
      prev.map((article) =>
        article.id === draggedEvent.id
          ? { ...article, scheduledAt: newScheduledAt }
          : article
      )
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const renderDay = (day: CalendarDay, index: number) => {
    const { date, isCurrentMonth, articles } = day;
    const isToday = isSameDay(date, new Date());

    return (
      <div
        key={`day-${index}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDayDrop(e, day)}
        className={`
          flex flex-col min-h-[100px] p-2 border border-gray-200
          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
          ${isToday ? 'ring-2 ring-blue-500' : ''}
          transition-all duration-200
          cursor-pointer hover:border-blue-400
        `}
      >
        <div className="text-sm font-medium text-gray-900">
          {format(date, 'd')}
        </div>

        {articles.length > 0 && (
          <div className="mt-2 space-y-1">
            {articles.map((article) => (
              <div
                key={article.id}
                draggable
                onDragStart={() => handleDragStart(article)}
                onDragEnd={handleDragEnd}
                className={`
                  p-2 rounded border text-xs
                  cursor-move
                  ${article.status === 'published' && 'border-green-200 bg-green-50'}
                  ${article.status === 'queued' && 'border-yellow-200 bg-yellow-50'}
                  ${article.status === 'failed' && 'border-red-200 bg-red-50'}
                  ${article.status === 'scheduled' && 'border-blue-200 bg-blue-50'}
                  hover:shadow-md
                `}
              >
                <div className="font-medium truncate">{article.title}</div>
                <div className="text-gray-500">
                  {format(parseISO(article.scheduledAt), 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day) => renderDay(day))}
      </div>

      {/* Conflicts Display */}
      {conflicts.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">
            ⚠️ Scheduling Conflicts
          </h3>
          {conflicts.map((conflict, index) => (
            <div key={`conflict-${index}`} className="text-sm text-yellow-800 mb-1">
              <div className="font-medium">{conflict.existingEvent.title}</div>
              <div>Conflicts with: {conflict.newEvent.start} - {conflict.newEvent.end}</div>
            </div>
          ))}
        </div>
      )}

      {/* Dragging State Indicator */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none flex items-center justify-center">
          <div className="text-2xl font-bold text-blue-700">
            Drop to reschedule
          </div>
        </div>
      )}
    </div>
  );
}
