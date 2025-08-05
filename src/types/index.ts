// Tipos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de tarefas
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'trabalho' | 'familia' | 'pessoal';
  priority: 'alta' | 'media' | 'baixa';
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de metas
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'trabalho' | 'pessoal' | 'familia' | 'financeiro' | 'saude';
  progress: number; // 0-100
  status: 'ativa' | 'concluida' | 'pausada';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de eventos
export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: Date;
  type: 'familia' | 'trabalho' | 'escola';
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de finanças
export interface Finance {
  id: string;
  userId: string;
  type: 'receita' | 'despesa';
  category: string;
  amount: number;
  description: string;
  date: Date;
  isBusiness: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de curso
export interface Lesson {
  title: string;
  duration: number; // em minutos
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number; // em minutos
  progress: number; // 0-100
  isPremium: boolean;
  category: 'empreendedorismo' | 'produtividade' | 'marketing' | 'financas' | 'vendas' | 'outros';
  thumbnail?: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de dashboard
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  activeGoals: number;
  upcomingEvents: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

// Tipos de autenticação
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Tipos de formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  category: 'trabalho' | 'familia' | 'pessoal';
  priority: 'alta' | 'media' | 'baixa';
  dueDate?: Date;
}

export interface GoalForm {
  title: string;
  description?: string;
  category: 'trabalho' | 'pessoal' | 'familia' | 'financeiro' | 'saude';
  dueDate?: Date;
}

export interface EventForm {
  title: string;
  description?: string;
  date: Date;
  type: 'familia' | 'trabalho' | 'escola';
}

export interface FinanceForm {
  type: 'receita' | 'despesa';
  category: string;
  amount: number;
  description: string;
  date: Date;
  isBusiness: boolean;
}

export interface CourseForm {
  title: string;
  description: string;
  duration: number;
  isPremium: boolean;
  category: 'empreendedorismo' | 'produtividade' | 'marketing' | 'financas' | 'vendas' | 'outros';
  thumbnail?: string;
  lessons: Lesson[];
}

// Tipos de configurações
export interface NotificationSettings {
  tasks: boolean;
  goals: boolean;
  events: boolean;
  finances: boolean;
  courses: boolean;
  email: boolean;
  push: boolean;
}

export interface PrivacySettings {
  shareProgress: boolean;
  shareStats: boolean;
  publicProfile: boolean;
}

export interface DisplaySettings {
  compactMode: boolean;
  showCompletedTasks: boolean;
  showCompletedGoals: boolean;
  dashboardLayout: 'default' | 'compact' | 'detailed';
}

export interface BusinessSettings {
  businessName: string;
  businessType: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  taxId: string;
}

export interface PreferenceSettings {
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  weekStart: 'monday' | 'sunday';
}

export interface Settings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
  business: BusinessSettings;
  preferences: PreferenceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsForm {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'pt-BR' | 'en-US' | 'es-ES';
  notifications?: Partial<NotificationSettings>;
  privacy?: Partial<PrivacySettings>;
  display?: Partial<DisplaySettings>;
  business?: Partial<BusinessSettings>;
  preferences?: Partial<PreferenceSettings>;
}

// Tipos de assinatura
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'BRL' | 'USD' | 'EUR';
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'bank_transfer';
  name: string;
  description: string;
  icon: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: 'BRL' | 'USD' | 'EUR';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  paymentMethod: string;
  mercadopagoId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentForm {
  planId: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: number;
}

// Tipos para Google OAuth
export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret?: string;
}

export interface GoogleLoginForm {
  credential: string;
  googleUser: GoogleUser;
} 