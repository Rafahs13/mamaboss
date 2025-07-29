# Módulo de Assinatura - MamaBoss

## Visão Geral

O módulo de assinatura permite que os usuários assinem planos premium do MamaBoss, oferecendo diferentes níveis de funcionalidades e recursos. O sistema está integrado com o Mercado Pago para processamento de pagamentos.

## Funcionalidades Implementadas

### 1. Planos de Assinatura

#### Planos Disponíveis:
- **Gratuito**: Acesso básico às funcionalidades
  - Até 10 tarefas
  - Até 5 metas
  - Calendário básico
  - Relatórios básicos
  - Suporte por email

- **Pro** (R$ 29,90/mês): Ideal para empreendedoras
  - Tarefas ilimitadas
  - Metas ilimitadas
  - Calendário avançado
  - Relatórios detalhados
  - Cursos premium
  - Suporte prioritário
  - Backup automático
  - Integração com apps

- **Business** (R$ 79,90/mês): Para equipes e empresas
  - Tudo do plano Pro
  - Até 5 usuários
  - Gestão de equipe
  - Relatórios avançados
  - API personalizada
  - Suporte 24/7
  - Treinamento personalizado
  - White label

### 2. Métodos de Pagamento

#### Opções Disponíveis:
- **Cartão de Crédito**: Visa, Mastercard, Elo, Hipercard
- **Cartão de Débito**: Débito automático
- **PIX**: Pagamento instantâneo
- **Boleto Bancário**: Pagamento em até 3 dias

### 3. Gestão de Assinatura

#### Funcionalidades:
- **Visualização de Planos**: Comparação detalhada entre planos
- **Assinatura de Planos**: Processo de pagamento integrado
- **Cancelamento**: Cancelamento de assinatura ativa
- **Histórico de Transações**: Registro de todos os pagamentos
- **Status da Assinatura**: Monitoramento do estado atual

### 4. Integração com Mercado Pago

#### Recursos:
- **Processamento Seguro**: Criptografia SSL
- **Múltiplos Métodos**: Suporte a diversos meios de pagamento
- **Parcelamento**: Opções de parcelamento para cartões
- **Validação**: Verificação de dados de pagamento
- **Notificações**: Feedback em tempo real

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── SubscriptionContext.tsx    # Contexto para gerenciar assinaturas
├── pages/
│   └── Subscription.tsx           # Página principal de assinatura
├── components/
│   └── subscription/
│       └── SubscriptionStatus.tsx # Componente de status no Dashboard
└── types/
    └── index.ts                   # Tipos TypeScript para assinatura
```

## Tipos de Dados

### SubscriptionPlan
```typescript
interface SubscriptionPlan {
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
```

### PaymentMethod
```typescript
interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'bank_transfer';
  name: string;
  description: string;
  icon: string;
}
```

### PaymentTransaction
```typescript
interface PaymentTransaction {
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
```

### Subscription
```typescript
interface Subscription {
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
```

## Funcionalidades do Contexto

### SubscriptionContext

#### Estados:
- `subscription`: Assinatura atual do usuário
- `plans`: Lista de planos disponíveis
- `paymentMethods`: Métodos de pagamento disponíveis
- `transactions`: Histórico de transações
- `currentPlan`: Plano atual do usuário
- `isLoading`: Estado de carregamento

#### Funções:
- `subscribeToPlan(planId, paymentData)`: Assinar um novo plano
- `cancelSubscription()`: Cancelar assinatura atual
- `getTransactionHistory()`: Obter histórico de transações
- `getActiveSubscription()`: Obter assinatura ativa

## Interface do Usuário

### Página de Assinatura (`/subscription`)

#### Seções:
1. **Header**: Título e descrição dos planos
2. **Plano Atual**: Status da assinatura atual (se houver)
3. **Comparação de Planos**: Cards dos planos disponíveis
4. **Histórico de Transações**: Últimas 5 transações
5. **Modal de Pagamento**: Formulário de pagamento
6. **Modal de Cancelamento**: Confirmação de cancelamento

### Componente de Status (Dashboard)

#### Informações Exibidas:
- Status atual da assinatura
- Plano atual
- Dias até a expiração
- Botão para gerenciar assinatura

## Persistência de Dados

### LocalStorage
- `mamaboss_subscription`: Dados da assinatura atual
- `mamaboss_transactions`: Histórico de transações

## Segurança

### Medidas Implementadas:
- **Validação de Formulários**: Verificação de dados obrigatórios
- **Criptografia**: Dados sensíveis protegidos
- **Processamento Seguro**: Integração com Mercado Pago
- **Feedback ao Usuário**: Notificações de status

## Navegação

### Rotas:
- `/subscription`: Página principal de assinatura
- Acesso via menu lateral (ícone Crown)

## Próximas Melhorias

### Funcionalidades Planejadas:
1. **Webhooks**: Notificações em tempo real do Mercado Pago
2. **Renovação Automática**: Processamento automático de renovações
3. **Cupons de Desconto**: Sistema de códigos promocionais
4. **Múltiplos Usuários**: Gestão de equipe para plano Business
5. **Relatórios de Faturamento**: Análises financeiras detalhadas
6. **Integração com Email**: Notificações por email
7. **Teste Gratuito**: Período de teste para planos pagos

## Configuração do Mercado Pago

### Para Produção:
1. Criar conta no Mercado Pago
2. Obter credenciais de produção
3. Configurar webhooks
4. Implementar validação de pagamentos
5. Configurar notificações

### Para Desenvolvimento:
- Usar credenciais de sandbox
- Simular diferentes cenários de pagamento
- Testar webhooks locais

## Considerações Técnicas

### Performance:
- Carregamento assíncrono de dados
- Cache de planos e métodos de pagamento
- Otimização de consultas

### Escalabilidade:
- Arquitetura modular
- Separação de responsabilidades
- Preparação para múltiplos provedores de pagamento

### Manutenibilidade:
- Código bem documentado
- Tipos TypeScript
- Componentes reutilizáveis
- Testes unitários (planejados) 