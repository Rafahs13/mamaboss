import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Goal, GoalForm } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockGoals } from '../utils/mockData';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
}

interface GoalContextType extends GoalState {
  addGoal: (goal: GoalForm) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  getGoalsByCategory: (category: string) => Goal[];
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
  getGoalsByStatus: (status: string) => Goal[];
}

type GoalAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<Goal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'UPDATE_PROGRESS'; payload: { id: string; progress: number } };

const initialState: GoalState = {
  goals: [],
  isLoading: true,
};

const goalReducer = (state: GoalState, action: GoalAction): GoalState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload, isLoading: false };
    case 'ADD_GOAL':
      return { ...state, goals: [action.payload, ...state.goals] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id
            ? { ...goal, ...action.payload.updates, updatedAt: new Date() }
            : goal
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id
            ? { 
                ...goal, 
                progress: action.payload.progress,
                status: action.payload.progress >= 100 ? 'concluida' : goal.status,
                updatedAt: new Date() 
              }
            : goal
        ),
      };
    default:
      return state;
  }
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  // Carregar metas do localStorage na inicialização
  useEffect(() => {
    const loadGoals = () => {
      try {
        const savedGoals = storage.get<Goal[]>(STORAGE_KEYS.GOALS);
        if (savedGoals && savedGoals.length > 0) {
          dispatch({ type: 'SET_GOALS', payload: savedGoals });
        } else {
          // Usar dados mock se não houver dados salvos
          dispatch({ type: 'SET_GOALS', payload: mockGoals });
        }
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
        dispatch({ type: 'SET_GOALS', payload: mockGoals });
      }
    };

    loadGoals();
  }, []);

  // Salvar metas no localStorage sempre que houver mudanças
  useEffect(() => {
    if (!state.isLoading) {
      storage.set(STORAGE_KEYS.GOALS, state.goals);
    }
  }, [state.goals, state.isLoading]);

  const addGoal = (goalForm: GoalForm) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      userId: '1', // Mock user ID
      ...goalForm,
      progress: 0,
      status: 'ativa',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } });
  };

  const deleteGoal = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const updateProgress = (id: string, progress: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { id, progress } });
  };

  const getGoalsByCategory = (category: string) => {
    return state.goals.filter(goal => goal.category === category);
  };

  const getActiveGoals = () => {
    return state.goals.filter(goal => goal.status === 'ativa');
  };

  const getCompletedGoals = () => {
    return state.goals.filter(goal => goal.status === 'concluida');
  };

  const getGoalsByStatus = (status: string) => {
    return state.goals.filter(goal => goal.status === status);
  };

  const value: GoalContextType = {
    ...state,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    getGoalsByCategory,
    getActiveGoals,
    getCompletedGoals,
    getGoalsByStatus,
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals deve ser usado dentro de um GoalProvider');
  }
  return context;
}; 