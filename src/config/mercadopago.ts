// Configuração do Mercado Pago
// Para produção, configure as credenciais corretas

export const mercadopagoConfig = {
  // Credenciais de Produção
  publicKey: process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || '',
  accessToken: process.env.REACT_APP_MERCADOPAGO_ACCESS_TOKEN || '',
  
  // URLs de retorno
  successUrl: process.env.NODE_ENV === 'production' 
    ? `${window.location.origin}/payment/success`
    : 'http://localhost:3000/payment/success',
    
  failureUrl: process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/payment/failure`
    : 'http://localhost:3000/payment/failure',
    
  pendingUrl: process.env.NODE_ENV === 'production'
    ? `${window.location.origin}/payment/pending`
    : 'http://localhost:3000/payment/pending',
    
  // Webhook URL (para produção)
  webhookUrl: process.env.REACT_APP_MERCADOPAGO_WEBHOOK_URL || '',
};

// Função para validar se a configuração está completa
export const isMercadoPagoConfigured = (): boolean => {
  return !!mercadopagoConfig.publicKey && 
         !!mercadopagoConfig.accessToken && 
         mercadopagoConfig.publicKey.trim() !== '' && 
         mercadopagoConfig.accessToken.trim() !== '';
};

// Função para obter o ambiente (sandbox/production)
export const getMercadoPagoEnvironment = (): 'sandbox' | 'production' => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
};

// Configurações de produtos
export const PRODUCTS = {
  PREMIUM_MONTHLY: {
    id: 'mamaboss-premium-monthly',
    title: 'MamaBoss Premium - Assinatura Mensal',
    price: 29.90,
    currency: 'BRL',
    description: 'Acesso completo a todas as funcionalidades premium do MamaBoss',
  },
  PREMIUM_YEARLY: {
    id: 'mamaboss-premium-yearly',
    title: 'MamaBoss Premium - Assinatura Anual',
    price: 299.90,
    currency: 'BRL',
    description: 'Acesso completo a todas as funcionalidades premium do MamaBoss (com desconto)',
  },
  BUSINESS_MONTHLY: {
    id: 'mamaboss-business-monthly',
    title: 'MamaBoss Business - Assinatura Mensal',
    price: 79.90,
    currency: 'BRL',
    description: 'Plano Business com gestão de equipe e recursos avançados',
  },
};

// Configurações de webhook (para produção)
export const WEBHOOK_CONFIG = {
  URL: process.env.REACT_APP_WEBHOOK_URL || 'https://seu-dominio.com/webhook/mercadopago',
  EVENTS: [
    'payment.created',
    'payment.updated',
    'payment.cancelled',
    'payment.refunded',
    'preapproval.created',
    'preapproval.updated',
    'preapproval.cancelled',
  ],
}; 