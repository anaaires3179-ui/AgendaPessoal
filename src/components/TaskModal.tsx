import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Task, Category } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  initialDate?: Date;
}

const CATEGORIES: Category[] = ['Trabalho', 'Pessoal', 'Saúde', 'Lazer', 'Outros'];

export default function TaskModal({ isOpen, onClose, onSave, initialDate }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Pessoal');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      category,
      time,
      date: new Date(date),
    });

    setTitle('');
    setDescription('');
    setCategory('Pessoal');
    setTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-[#F8F7F3] border border-black w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="px-8 py-6 border-b border-black/10 flex items-center justify-between bg-white">
            <h2 className="text-2xl font-serif font-black tracking-tight">Novo Evento</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">
                O que você vai fazer?
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="EX: REUNIÃO DE DESIGN"
                className="w-full px-0 py-2 bg-transparent border-b-2 border-black/10 focus:border-black focus:outline-none transition-all font-sans font-bold text-lg placeholder:text-black/10 uppercase tracking-tight"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-b border-black/10 focus:border-black focus:outline-none transition-all font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-b border-black/10 focus:border-black focus:outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all border ${
                      category === cat
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black/40 border-black/10 hover:border-black hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              Adicionar Compromisso
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
