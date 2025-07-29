import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskForm } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockTasks } from '../utils/mockData';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
}

interface TaskContextType extends TaskState {
  addTask: (task: TaskForm) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  getTasksByCategory: (category: string) => Task[];
  getTasksByPriority: (priority: string) => Task[];
  getPendingTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string };

const initialState: TaskState = {
  tasks: [],
  isLoading: true,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, isLoading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        ),
      };
    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Carregar tarefas do localStorage na inicialização
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = storage.get<Task[]>(STORAGE_KEYS.TASKS);
        if (savedTasks && savedTasks.length > 0) {
          dispatch({ type: 'SET_TASKS', payload: savedTasks });
        } else {
          // Usar dados mock se não houver dados salvos
          dispatch({ type: 'SET_TASKS', payload: mockTasks });
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        dispatch({ type: 'SET_TASKS', payload: mockTasks });
      }
    };

    loadTasks();
  }, []);

  // Salvar tarefas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (!state.isLoading) {
      storage.set(STORAGE_KEYS.TASKS, state.tasks);
    }
  }, [state.tasks, state.isLoading]);

  const addTask = (taskForm: TaskForm) => {
    const newTask: Task = {
      id: Date.now().toString(),
      userId: '1', // Mock user ID
      ...taskForm,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskComplete = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const getTasksByCategory = (category: string) => {
    return state.tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority: string) => {
    return state.tasks.filter(task => task.priority === priority);
  };

  const getPendingTasks = () => {
    return state.tasks.filter(task => !task.completed);
  };

  const getCompletedTasks = () => {
    return state.tasks.filter(task => task.completed);
  };

  const value: TaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByCategory,
    getTasksByPriority,
    getPendingTasks,
    getCompletedTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks deve ser usado dentro de um TaskProvider');
  }
  return context;
}; 