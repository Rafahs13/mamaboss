import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Subscription, 
  SubscriptionPlan, 
  PaymentTransaction, 
  PaymentForm,
  PaymentMethod 
} from '../types';
import { generateId } from '../utils/storage';

interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  transactions: PaymentTransaction[];
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  subscribeToPlan: (planId: string, paymentData: PaymentForm) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getTransactionHistory: () => PaymentTransaction[];
  getActiveSubscription: () => Subscription | null;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Acesso básico às funcionalidades',
    price: 0,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Até 10 tarefas',
      'Até 5 metas',
      'Calendário básico',
      'Relatórios básicos',
      'Suporte por email'
    ],
    isCurrent: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Ideal para empreendedoras',
    price: 29.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Tarefas ilimitadas',
      'Metas ilimitadas',
      'Calendário avançado',
      'Relatórios detalhados',
      'Cursos premium',
      'Suporte prioritário',
      'Backup automático',
      'Integração com apps'
    ],
    isPopular: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para equipes e empresas',
    price: 79.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Tudo do plano Pro',
      'Até 5 usuários',
      'Gestão de equipe',
      'Relatórios avançados',
      'API personalizada',
      'Suporte 24/7',
      'Treinamento personalizado',
      'White label'
    ]
  }
];

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    type: 'credit_card',
    name: 'Cartão de Crédito',
    description: 'Visa, Mastercard, Elo, Hipercard',
    icon: '💳'
  },
  {
    id: 'debit_card',
    type: 'debit_card',
    name: 'Cartão de Débito',
    description: 'Débito automático',
    icon: '🏦'
  },
  {
    id: 'pix',
    type: 'pix',
    name: 'PIX',
    description: 'Pagamento instantâneo',
    icon: '📱'
  },
  {
    id: 'boleto',
    type: 'boleto',
    name: 'Boleto Bancário',
    description: 'Pagamento em até 3 dias',
    icon: '📄'
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plans = defaultPlans;
  const paymentMethods = defaultPaymentMethods;

  // Carregar dados do localStorage
  useEffect(() => {
    const loadSubscriptionData = () => {
      try {
        const storedSubscription = localStorage.getItem('mamaboss_subscription');
        const storedTransactions = localStorage.getItem('mamaboss_transactions');

        if (storedSubscription) {
          const parsedSubscription = JSON.parse(storedSubscription);
          setSubscription({
            ...parsedSubscription,
            startDate: new Date(parsedSubscription.startDate),
            endDate: new Date(parsedSubscription.endDate),
            createdAt: new Date(parsedSubscription.createdAt),
            updatedAt: new Date(parsedSubscription.updatedAt),
          });
        }

        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions);
          setTransactions(parsedTransactions.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de assinatura:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  // Salvar dados no localStorage
  const saveSubscriptionData = (newSubscription: Subscription | null, newTransactions: PaymentTransaction[]) => {
    try {
      if (newSubscription) {
        localStorage.setItem('mamaboss_subscription', JSON.stringify(newSubscription));
      } else {
        localStorage.removeItem('mamaboss_subscription');
      }
      
      localStorage.setItem('mamaboss_transactions', JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Erro ao salvar dados de assinatura:', error);
    }
  };

  // Simular integração com Mercado Pago
  const processPayment = async (paymentData: PaymentForm): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    // Simular processamento de pagamento
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular sucesso 90% das vezes
        const success = Math.random() > 0.1;
        
        if (success) {
          const transactionId = `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          resolve({ success: true, transactionId });
        } else {
          resolve({ success: false, error: 'Pagamento recusado. Verifique os dados do cartão.' });
        }
      }, 2000);
    });
  };

  // Assinar um plano
  const subscribeToPlan = async (planId: string, paymentData: PaymentForm): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plano não encontrado');
      }

      // Processar pagamento
      const paymentResult = await processPayment(paymentData);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Erro no processamento do pagamento');
      }

      // Criar transação
      const transaction: PaymentTransaction = {
        id: generateId(),
        userId: 'current-user', // Em produção, usar ID do usuário logado
        planId,
        amount: plan.price,
        currency: plan.currency,
        status: 'approved',
        paymentMethod: paymentData.paymentMethod,
        mercadopagoId: paymentResult.transactionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Criar assinatura
      const newSubscription: Subscription = {
        id: generateId(),
        userId: 'current-user',
        planId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        autoRenew: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newTransactions = [...transactions, transaction];
      
      setSubscription(newSubscription);
      setTransactions(newTransactions);
      saveSubscriptionData(newSubscription, newTransactions);

      return true;
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar assinatura
  const cancelSubscription = async (): Promise<boolean> => {
    if (!subscription) return false;

    setIsLoading(true);
    
    try {
      const updatedSubscription: Subscription = {
        ...subscription,
        status: 'cancelled',
        autoRenew: false,
        updatedAt: new Date(),
      };

      setSubscription(updatedSubscription);
      saveSubscriptionData(updatedSubscription, transactions);
      
      return true;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obter histórico de transações
  const getTransactionHistory = (): PaymentTransaction[] => {
    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  // Obter assinatura ativa
  const getActiveSubscription = (): Subscription | null => {
    if (!subscription || subscription.status !== 'active') {
      return null;
    }
    return subscription;
  };

  // Obter plano atual
  const currentPlan = subscription ? plans.find(p => p.id === subscription.planId) || null : null;

  const value: SubscriptionContextType = {
    subscription,
    plans,
    paymentMethods,
    transactions,
    currentPlan,
    isLoading,
    subscribeToPlan,
    cancelSubscription,
    getTransactionHistory,
    getActiveSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
}; 