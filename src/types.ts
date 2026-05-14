export type Category = 'Trabalho' | 'Pessoal' | 'Saúde' | 'Lazer' | 'Outros';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  category: Category;
  completed: boolean;
  createdAt: Date;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Trabalho: 'bg-blue-100 text-blue-700 border-blue-200',
  Pessoal: 'bg-purple-100 text-purple-700 border-purple-200',
  Saúde: 'bg-green-100 text-green-700 border-green-200',
  Lazer: 'bg-amber-100 text-amber-700 border-amber-200',
  Outros: 'bg-slate-100 text-slate-700 border-slate-200',
};
