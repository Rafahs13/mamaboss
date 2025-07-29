import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginForm, RegisterForm } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockUser } from '../utils/mockData';

// Tipos para o contexto
interface AuthContextType extends AuthState {
  login: (form: LoginForm) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Tipos de ações
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    default:
      return state;
  }
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = storage.get<User>(STORAGE_KEYS.USER);
        if (savedUser) {
          dispatch({ type: 'SET_USER', payload: savedUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (form: LoginForm): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação simples (em produção seria feita no backend)
      if (form.email === 'rafaela@mamaboss.com.br' && form.password === '123456') {
        const user = { ...mockUser, updatedAt: new Date() };
        storage.set(STORAGE_KEYS.USER, user);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        throw new Error('Email ou senha incorretos');
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Função de registro
  const register = async (form: RegisterForm): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação de senha
      if (form.password !== form.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      storage.set(STORAGE_KEYS.USER, newUser);
      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Função de logout
  const logout = (): void => {
    storage.remove(STORAGE_KEYS.USER);
    dispatch({ type: 'SET_USER', payload: null });
  };

  // Função para atualizar usuário
  const updateUser = (userData: Partial<User>): void => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData, updatedAt: new Date() };
      storage.set(STORAGE_KEYS.USER, updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 