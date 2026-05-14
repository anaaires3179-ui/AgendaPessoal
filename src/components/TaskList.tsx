import React from 'react';
import { format, isSameDay, isAfter, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { Task, CATEGORY_COLORS } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDelete }: TaskListProps) {
  const today = startOfToday();
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return (a.time || '').localeCompare(b.time || '');
  });

  const upcomingTasks = sortedTasks.filter(t => !t.completed && (isSameDay(t.date, today) || isAfter(t.date, today)));

  return (
    <div className="flex flex-col h-full bg-white border border-black/10">
      <div className="flex-1 overflow-y-auto divide-y divide-black/5">
        <AnimatePresence mode="popLayout">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={task.id}
                className="group relative flex justify-between items-start p-6 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
              >
                <div className="flex gap-8 items-start">
                  <span className="font-mono text-[13px] opacity-40 group-hover:opacity-100 pt-1">
                    {task.time || '--:--'}
                  </span>
                  <div>
                    <h3 className={cn(
                      "text-[18px] font-bold font-sans tracking-tight",
                      task.completed && "line-through opacity-30"
                    )}>
                      {task.title}
                    </h3>
                    <p className="text-[14px] opacity-50 group-hover:opacity-70 italic font-serif">
                      {isSameDay(task.date, today) ? 'Hoje' : format(task.date, 'dd MMM', { locale: ptBR })} — {task.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className="w-5 h-5 rounded-full border border-black/20 group-hover:border-white/40 flex items-center justify-center transition-all"
                  >
                    {task.completed && <div className="w-2.5 h-2.5 bg-black group-hover:bg-white rounded-full" />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-60 p-2 hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30 py-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]">Nenhum compromisso pendente</p>
              <p className="text-[14px] font-serif italic mt-2">Sua agenda está limpa.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
