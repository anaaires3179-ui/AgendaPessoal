import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Task, CATEGORY_COLORS } from '../types';

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  tasks: Task[];
  onDateClick: (date: Date) => void;
}

export default function Calendar({ currentDate, setCurrentDate, tasks, onDateClick }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full border border-black/5">
      <div className="px-6 py-6 flex items-center justify-between border-b border-black/10">
        <div>
          <h2 className="text-[28px] font-serif font-black capitalize tracking-tight">
            {format(currentDate, 'MMMM', { locale: ptBR })}
          </h2>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">
            Ano de {format(currentDate, 'yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="p-1 hover:opacity-100 opacity-30 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:opacity-100 opacity-30 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-black/10">
        {weekDays.map((day, i) => (
          <div key={i} className="py-2 text-center text-[10px] font-black tracking-widest text-black/20">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((day, idx) => {
          const dayTasks = tasks.filter((t) => isSameDay(t.date, day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={cn(
                "min-h-[90px] p-2 border-r border-b border-black/5 transition-all group cursor-pointer hover:bg-black hover:text-white",
                !isCurrentMonth && "opacity-[0.05] pointer-events-none",
                idx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-[14px] font-serif font-bold",
                    isToday && !dayTasks.length && "underline decoration-2 underline-offset-4"
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <div className={cn(
                    "w-1 h-1 rounded-full bg-black group-hover:bg-white transition-colors",
                    isToday && "bg-blue-500"
                  )} />
                )}
              </div>
              
              <div className="space-y-1 mt-2">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="text-[9px] truncate font-bold uppercase tracking-tighter opacity-40 group-hover:opacity-100"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
