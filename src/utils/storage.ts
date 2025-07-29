// Utilitários para gerenciamento de dados locais
export const storage = {
  // Salvar dados no localStorage
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  // Recuperar dados do localStorage
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return defaultValue || null;
    }
  },

  // Remover dados do localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  },

  // Limpar todos os dados
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  },
};

// Chaves para diferentes tipos de dados
export const STORAGE_KEYS = {
  USER: 'mamaboss_user',
  TASKS: 'mamaboss_tasks',
  GOALS: 'mamaboss_goals',
  EVENTS: 'mamaboss_events',
  FINANCES: 'mamaboss_finances',
  COURSES: 'mamaboss_courses',
  SETTINGS: 'mamaboss_settings',
} as const;

// Gerar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 