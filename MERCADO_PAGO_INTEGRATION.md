# Integração com Mercado Pago - MamaBoss

## Visão Geral

Este documento descreve a integração completa do MamaBoss com o Mercado Pago para processamento de pagamentos de assinaturas premium.

## Credenciais Configuradas

### Credenciais de Produção
```javascript
PUBLIC_KEY: 'APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95'
ACCESS_TOKEN: 'APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487'
CLIENT_ID: '4694434875461012'
CLIENT_SECRET: 'jGtL4UCGSfsBhZHPeabNYbWkkUab8Wcy'
```

## Estrutura da Integração

### 1. Configuração Centralizada
**Arquivo**: `src/config/mercadopago.ts`

```typescript
export const MERCADO_PAGO_CONFIG = {
  PUBLIC_KEY: 'APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95',
  ACCESS_TOKEN: 'APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487',
  CLIENT_ID: '4694434875461012',
  CLIENT_SECRET: 'jGtL4UCGSfsBhZHPeabNYbWkkUab8Wcy',
  BASE_URL: 'https://api.mercadopago.com',
};
```

### 2. Produtos Configurados
```typescript
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
```

## Componentes Implementados

### 1. PremiumModal
**Arquivo**: `src/components/subscription/PremiumModal.tsx`

#### Funcionalidades:
- Modal específico para assinatura premium
- Integração com Wallet do Mercado Pago
- Criação automática de preferências de pagamento
- Tratamento de sucesso e erro
- Interface responsiva e atrativa

#### Fluxo de Pagamento:
1. Usuário clica em "Assinar Premium"
2. Sistema cria preferência de pagamento via API
3. Wallet do Mercado Pago é inicializado
4. Usuário escolhe método de pagamento
5. Processamento do pagamento
6. Redirecionamento com status

### 2. PremiumButton
**Arquivo**: `src/components/subscription/PremiumButton.tsx`

#### Funcionalidades:
- Botão reutilizável para assinatura premium
- Verificação automática de plano atual
- Design atrativo com gradiente
- Integração com PremiumModal

### 3. PremiumBanner
**Arquivo**: `src/components/subscription/PremiumBanner.tsx`

#### Funcionalidades:
- Banner promocional no Dashboard
- Lista de benefícios premium
- Call-to-action direto
- Design responsivo

## Fluxo de Pagamento

### 1. Criação de Preferência
```typescript
const createPreference = async (): Promise<string> => {
  const preferenceData = {
    items: [{
      id: PRODUCTS.PREMIUM_MONTHLY.id,
      title: PRODUCTS.PREMIUM_MONTHLY.title,
      quantity: 1,
      unit_price: PRODUCTS.PREMIUM_MONTHLY.price,
      currency_id: PRODUCTS.PREMIUM_MONTHLY.currency,
    }],
    back_urls: getReturnUrls(),
    auto_return: 'approved',
    external_reference: `user_${Date.now()}`,
  };

  const response = await fetch(`${MERCADO_PAGO_CONFIG.BASE_URL}/checkout/preferences`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferenceData),
  });

  const data = await response.json();
  return data.id;
};
```

### 2. URLs de Retorno
```typescript
export const getReturnUrls = () => ({
  success: `${window.location.origin}/subscription?status=success`,
  failure: `${window.location.origin}/subscription?status=failure`,
  pending: `${window.location.origin}/subscription?status=pending`,
});
```

### 3. Wallet Integration
```typescript
<Wallet
  initialization={{ redirectMode: 'self' }}
  onReady={() => console.log('Wallet ready')}
  onSubmit={handleSuccess}
  onError={handleFailure}
/>
```

## Métodos de Pagamento Suportados

### 1. Cartão de Crédito
- Visa
- Mastercard
- Elo
- Hipercard
- Parcelamento em até 12x

### 2. Cartão de Débito
- Débito automático
- Processamento instantâneo

### 3. PIX
- Pagamento instantâneo
- QR Code para pagamento

### 4. Boleto Bancário
- Pagamento em até 3 dias úteis
- Código de barras

## Segurança

### 1. Criptografia SSL
- Todas as transações são criptografadas
- Dados sensíveis protegidos

### 2. Validação de Dados
- Verificação de campos obrigatórios
- Validação de formato de cartão
- Verificação de CVV

### 3. Tokenização
- Dados de cartão tokenizados
- Não armazenamento de dados sensíveis

## Monitoramento e Logs

### 1. Logs de Transação
```typescript
console.log('Preference created:', preferenceId);
console.log('Payment status:', status);
console.log('Transaction ID:', transactionId);
```

### 2. Tratamento de Erros
```typescript
try {
  const preferenceId = await createPreference();
  // Processamento
} catch (error) {
  console.error('Erro ao criar preferência:', error);
  setError('Não foi possível processar o pagamento');
}
```

## Configuração para Produção

### 1. Webhooks
```typescript
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
```

### 2. Variáveis de Ambiente
```bash
REACT_APP_MERCADO_PAGO_PUBLIC_KEY=APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95
REACT_APP_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487
REACT_APP_WEBHOOK_URL=https://seu-dominio.com/webhook/mercadopago
```

### 3. Configuração de Domínio
- Adicionar domínio no painel do Mercado Pago
- Configurar URLs de retorno
- Configurar webhooks

## Testes

### 1. Cartões de Teste
```javascript
// Cartão aprovado
4111111111111111

// Cartão rejeitado
4000000000000002

// Cartão pendente
4000000000000127
```

### 2. Cenários de Teste
- Pagamento aprovado
- Pagamento rejeitado
- Pagamento pendente
- Cancelamento
- Reembolso

## Manutenção

### 1. Monitoramento
- Verificar logs de transação
- Monitorar taxa de aprovação
- Acompanhar chargebacks

### 2. Atualizações
- Manter SDK atualizado
- Verificar mudanças na API
- Testar após atualizações

### 3. Backup
- Backup das configurações
- Backup dos logs
- Backup das transações

## Suporte

### 1. Documentação Mercado Pago
- [Documentação Oficial](https://www.mercadopago.com.br/developers)
- [SDK React](https://github.com/mercadopago/sdk-react)
- [API Reference](https://www.mercadopago.com.br/developers/reference)

### 2. Contato
- Suporte técnico Mercado Pago
- Equipe de desenvolvimento MamaBoss
- Documentação interna

## Próximas Melhorias

### 1. Funcionalidades Planejadas
- [ ] Assinatura recorrente automática
- [ ] Cupons de desconto
- [ ] Teste gratuito
- [ ] Múltiplas moedas
- [ ] Relatórios de faturamento

### 2. Otimizações
- [ ] Cache de preferências
- [ ] Lazy loading do Wallet
- [ ] Otimização de performance
- [ ] Analytics de conversão

### 3. Segurança
- [ ] Validação adicional
- [ ] Rate limiting
- [ ] Monitoramento de fraudes
- [ ] Auditoria de segurança 