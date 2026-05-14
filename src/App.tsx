/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { Task } from './types';
import { Plus, Calendar as CalendarIcon, ListCheck, Search, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('minha-agenda-tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt)
        })));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('minha-agenda-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#1A1A1A] font-sans flex overflow-hidden">
      {/* Structural Sidebar */}
      <aside className="w-60 border-r border-black/10 flex flex-col justify-between p-10 bg-white/50 hidden md:flex">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40">Agenda v.1.0</span>
          
          <div className="mt-12 space-y-4">
            <p className="text-[14px] font-bold border-b border-black pb-1 w-fit cursor-pointer">Calendário</p>
            <p className="text-[14px] opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Foco</p>
            <p className="text-[14px] opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Arquivo</p>
            <p className="text-[14px] opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Configurações</p>
          </div>
          
          <div className="mt-12">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20" size={14} />
              <input 
                type="text" 
                placeholder="BUSCAR..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 py-2 bg-transparent border-none text-[10px] font-bold tracking-widest focus:outline-none placeholder:text-black/20"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="writing-vertical rotate-180 text-[48px] font-serif font-black tracking-tighter leading-none opacity-5 uppercase select-none">
            {format(currentDate, 'MMMM', { locale: ptBR })}
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-40 mt-8">Brasil, 2025</span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Massive Hero Header */}
        <header className="min-h-[240px] border-b border-black/10 flex items-end p-12 bg-white relative">
          <div className="flex items-baseline gap-6 flex-wrap">
            <h1 className="text-[120px] md:text-[180px] font-serif font-black leading-[0.7] tracking-tighter">
              {format(new Date(), 'dd')}
            </h1>
            <div className="flex flex-col">
              <span className="text-[24px] md:text-[32px] font-serif italic capitalize">
                {format(new Date(), 'EEEE', { locale: ptBR })}
              </span>
              <span className="text-[12px] md:text-[14px] font-bold tracking-widest uppercase opacity-40 mt-1">
                {format(new Date(), 'MMMM yyyy', { locale: ptBR })} — Semana {format(new Date(), 'I')}
              </span>
            </div>
          </div>
          
          <div className="absolute top-12 right-12 flex items-center gap-4">
            <button className="relative p-2 opacity-40 hover:opacity-100 transition-opacity">
              <Bell size={20} />
              {tasks.length > 0 && completionRate < 100 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 md:p-12 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
          {/* Calendar Section */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-40">Calendário Mensal</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                >
                  Hoje
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-black p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
              <Calendar 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                tasks={filteredTasks}
                onDateClick={handleDateClick}
              />
            </div>
          </section>

          {/* Sidebar content (Tasks & Focus) */}
          <section className="flex flex-col gap-12">
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-40 mb-6">Próximos Compromissos</h2>
              <TaskList 
                tasks={filteredTasks} 
                onToggleComplete={toggleTask} 
                onDelete={deleteTask}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-40">Notas & Progresso</h2>
              <div className="bg-black text-[#F8F7F3] p-8 rounded-sm rotate-1 flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ListCheck size={64} />
                </div>
                <p className="font-serif text-[20px] leading-snug italic relative z-10">
                  {completionRate === 100 
                    ? "\"Todos os compromissos concluídos. Tempo de descanso.\""
                    : completionRate > 50
                    ? "\"O progresso é constante. Mantenha o ritmo.\""
                    : "\"Cada pequena tarefa aproxima você do seu grande objetivo.\""}
                </p>
                <div className="flex justify-between items-end mt-4 relative z-10">
                  <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                    Agenda Status: {completionRate}%
                  </span>
                  <div className="text-[18px] font-serif font-black">{completedCount}/{totalCount}</div>
                </div>
              </div>
              
              <div className="p-6 border border-black/10 rounded-sm bg-white/30 backdrop-blur-sm">
                <p className="text-[12px] leading-relaxed opacity-70 italic font-serif">
                  Dica: Use compromissos curtos para tarefas de alta prioridade. Bloqueie tempo de foco no início do dia.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTask}
        initialDate={selectedDate}
      />
    </div>
  );
}

