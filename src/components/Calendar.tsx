import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DiaryEntry } from '../types/diary';

interface Props {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  entries: DiaryEntry[];
}

export const Calendar: React.FC<Props> = ({
  selectedDate,
  onDateSelect,
  entries
}) => {
  const firstDayOfMonth = startOfMonth(selectedDate);
  const lastDayOfMonth = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const previousMonth = () => {
    onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const hasEntry = (date: Date) => {
    return entries.some(entry => isSameDay(new Date(entry.date), date));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Calendar Header */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">
            {format(selectedDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentMonth = isSameMonth(date, selectedDate);
            const isCurrentDay = isToday(date);
            const hasEntryForDay = hasEntry(date);

            return (
              <button
                key={date.toString()}
                onClick={() => onDateSelect(date)}
                className={`
                  p-2 rounded-lg text-sm relative
                  ${isCurrentMonth ? 'text-gray-700 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
                  ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  ${isCurrentDay && !isSelected ? 'ring-2 ring-primary-600 dark:ring-primary-400' : ''}
                  transition-all
                `}
              >
                <span>{format(date, 'd')}</span>
                {hasEntryForDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};