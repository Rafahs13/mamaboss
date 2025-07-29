// Configurações do Mercado Pago
export const MERCADO_PAGO_CONFIG = {
  PUBLIC_KEY: process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95',
  ACCESS_TOKEN: process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487',
  CLIENT_ID: process.env.REACT_APP_MERCADO_PAGO_CLIENT_ID || '4694434875461012',
  CLIENT_SECRET: process.env.REACT_APP_MERCADO_PAGO_CLIENT_SECRET || 'jGtL4UCGSfsBhZHPeabNYbWkkUab8Wcy',
  BASE_URL: 'https://api.mercadopago.com',
};

// URLs de retorno
export const getReturnUrls = () => ({
  success: `${window.location.origin}/subscription?status=success`,
  failure: `${window.location.origin}/subscription?status=failure`,
  pending: `${window.location.origin}/subscription?status=pending`,
});

// URL do webhook para produção
export const getWebhookUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return `${window.location.origin}/api/webhook/mercadopago`;
  }
  return undefined; // Não usar webhook em desenvolvimento
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