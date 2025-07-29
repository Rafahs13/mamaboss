import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Finance, FinanceForm } from '../types';
import { generateId } from '../utils/storage';

interface FinanceContextType {
  finances: Finance[];
  addFinance: (financeData: FinanceForm) => void;
  updateFinance: (id: string, financeData: FinanceForm) => void;
  deleteFinance: (id: string) => void;
  getFinancesByMonth: (year: number, month: number) => Finance[];
  getFinancesByType: (type: 'receita' | 'despesa') => Finance[];
  getFinancesByCategory: (category: string) => Finance[];
  getFinancesByBusiness: (isBusiness: boolean) => Finance[];
  getMonthlyStats: (year: number, month: number) => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    businessIncome: number;
    businessExpenses: number;
    personalIncome: number;
    personalExpenses: number;
  };
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar finanças do localStorage
  useEffect(() => {
    const loadFinances = () => {
      try {
        const storedFinances = localStorage.getItem('mamaboss_finances');
        if (storedFinances) {
          const parsedFinances = JSON.parse(storedFinances).map((finance: any) => ({
            ...finance,
            date: new Date(finance.date),
            createdAt: new Date(finance.createdAt),
            updatedAt: new Date(finance.updatedAt),
          }));
          setFinances(parsedFinances);
        }
      } catch (error) {
        console.error('Erro ao carregar finanças:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinances();
  }, []);

  // Salvar finanças no localStorage
  const saveFinances = (newFinances: Finance[]) => {
    try {
      localStorage.setItem('mamaboss_finances', JSON.stringify(newFinances));
    } catch (error) {
      console.error('Erro ao salvar finanças:', error);
    }
  };

  // Adicionar nova transação financeira
  const addFinance = (financeData: FinanceForm) => {
    const newFinance: Finance = {
      id: generateId(),
      userId: '1', // TODO: Usar ID do usuário logado
      ...financeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFinances = [...finances, newFinance];
    setFinances(updatedFinances);
    saveFinances(updatedFinances);
  };

  // Atualizar transação financeira
  const updateFinance = (id: string, financeData: FinanceForm) => {
    const updatedFinances = finances.map(finance =>
      finance.id === id
        ? { ...finance, ...financeData, updatedAt: new Date() }
        : finance
    );
    setFinances(updatedFinances);
    saveFinances(updatedFinances);
  };

  // Excluir transação financeira
  const deleteFinance = (id: string) => {
    const updatedFinances = finances.filter(finance => finance.id !== id);
    setFinances(updatedFinances);
    saveFinances(updatedFinances);
  };

  // Obter finanças por mês
  const getFinancesByMonth = (year: number, month: number): Finance[] => {
    return finances.filter(finance => {
      const financeDate = new Date(finance.date);
      return financeDate.getFullYear() === year && financeDate.getMonth() === month;
    });
  };

  // Obter finanças por tipo (receita/despesa)
  const getFinancesByType = (type: 'receita' | 'despesa'): Finance[] => {
    return finances.filter(finance => finance.type === type);
  };

  // Obter finanças por categoria
  const getFinancesByCategory = (category: string): Finance[] => {
    return finances.filter(finance => finance.category === category);
  };

  // Obter finanças por tipo de negócio (pessoal/negócio)
  const getFinancesByBusiness = (isBusiness: boolean): Finance[] => {
    return finances.filter(finance => finance.isBusiness === isBusiness);
  };

  // Obter estatísticas mensais
  const getMonthlyStats = (year: number, month: number) => {
    const monthFinances = getFinancesByMonth(year, month);
    
    const totalIncome = monthFinances
      .filter(f => f.type === 'receita')
      .reduce((sum, f) => sum + f.amount, 0);

    const totalExpenses = monthFinances
      .filter(f => f.type === 'despesa')
      .reduce((sum, f) => sum + f.amount, 0);

    const businessIncome = monthFinances
      .filter(f => f.type === 'receita' && f.isBusiness)
      .reduce((sum, f) => sum + f.amount, 0);

    const businessExpenses = monthFinances
      .filter(f => f.type === 'despesa' && f.isBusiness)
      .reduce((sum, f) => sum + f.amount, 0);

    const personalIncome = monthFinances
      .filter(f => f.type === 'receita' && !f.isBusiness)
      .reduce((sum, f) => sum + f.amount, 0);

    const personalExpenses = monthFinances
      .filter(f => f.type === 'despesa' && !f.isBusiness)
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      businessIncome,
      businessExpenses,
      personalIncome,
      personalExpenses,
    };
  };

  const value: FinanceContextType = {
    finances,
    addFinance,
    updateFinance,
    deleteFinance,
    getFinancesByMonth,
    getFinancesByType,
    getFinancesByCategory,
    getFinancesByBusiness,
    getMonthlyStats,
    isLoading,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinances = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinances deve ser usado dentro de um FinanceProvider');
  }
  return context;
}; 