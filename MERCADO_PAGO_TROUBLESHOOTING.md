# Solução de Problemas - Integração Mercado Pago

## Problema: Erro 400 ao criar preferência

### Diagnóstico
O erro 400 indica que há um problema com a requisição enviada para a API do Mercado Pago. Isso pode ser causado por:

1. **Credenciais inválidas**
2. **Problemas de CORS**
3. **Estrutura de dados incorreta**
4. **Limitações de ambiente de desenvolvimento**

## Soluções Implementadas

### 1. Modo de Teste (Atual)
Implementamos um modo de simulação para testes que permite:
- Testar o fluxo completo da interface
- Verificar a integração com o contexto de assinatura
- Simular pagamentos aprovados e rejeitados
- Desenvolver sem depender da API externa

### 2. Logs Detalhados
Adicionamos logs extensivos para debug:
```javascript
console.log('Criando preferência com dados:', preferenceData);
console.log('Response status:', response.status);
console.log('Response headers:', response.headers);
console.log('Preferência criada:', data);
```

## Como Ativar o Modo de Produção

### 1. Editar PremiumModal.tsx
Localize o arquivo `src/components/subscription/PremiumModal.tsx` e na função `handlePayment`:

```javascript
// COMENTE estas linhas (modo de teste):
const mockPreferenceId = `test_pref_${Date.now()}`;
setPreferenceId(mockPreferenceId);
setWalletInitialization(true);

// DESCOMENTE estas linhas (modo de produção):
const preferenceId = await createPreference();
setPreferenceId(preferenceId);
setWalletInitialization(true);
```

### 2. Verificar Credenciais
Confirme que as credenciais em `src/config/mercadopago.ts` estão corretas:

```javascript
export const MERCADO_PAGO_CONFIG = {
  PUBLIC_KEY: 'APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95',
  ACCESS_TOKEN: 'APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487',
  // ...
};
```

### 3. Configurar CORS (se necessário)
Se o erro persistir, pode ser necessário configurar um proxy ou backend:

```javascript
// Opção 1: Usar proxy no package.json
{
  "proxy": "https://api.mercadopago.com"
}

// Opção 2: Criar backend próprio
// Implementar endpoint que faz a requisição para o Mercado Pago
```

## Possíveis Causas do Erro 400

### 1. Credenciais de Teste vs Produção
- **Teste**: Use credenciais de sandbox
- **Produção**: Use credenciais de produção

### 2. Estrutura de Dados
Verifique se todos os campos obrigatórios estão presentes:
```javascript
{
  items: [{
    id: string,
    title: string,
    quantity: number,
    unit_price: number,
    currency_id: string
  }],
  back_urls: {
    success: string,
    failure: string,
    pending: string
  },
  auto_return: string,
  external_reference: string
}
```

### 3. URLs de Retorno
Certifique-se de que as URLs são válidas e acessíveis:
```javascript
back_urls: {
  success: 'https://seu-dominio.com/success',
  failure: 'https://seu-dominio.com/failure',
  pending: 'https://seu-dominio.com/pending'
}
```

## Teste Atual (Modo Simulação)

### Como Testar
1. Acesse o sistema em `http://localhost:3000`
2. Faça login com as credenciais de demonstração
3. Clique em "Assinar Premium"
4. Veja a interface de simulação
5. Teste os botões "Aprovado" e "Rejeitado"

### Benefícios do Modo de Teste
- ✅ Fluxo completo testável
- ✅ Interface funcional
- ✅ Integração com contexto
- ✅ Sem dependências externas
- ✅ Desenvolvimento rápido

## Próximos Passos para Produção

### 1. Configurar Backend
Para evitar problemas de CORS, considere criar um backend que:
- Recebe requisições do frontend
- Faz requisições para o Mercado Pago
- Retorna respostas para o frontend

### 2. Implementar Webhooks
```javascript
// Endpoint para receber notificações
POST /webhook/mercadopago
{
  "type": "payment",
  "data": {
    "id": "payment_id"
  }
}
```

### 3. Configurar Domínio
- Adicionar domínio no painel do Mercado Pago
- Configurar URLs de retorno
- Configurar webhooks

### 4. Testes de Produção
- Usar cartões de teste reais
- Testar todos os métodos de pagamento
- Verificar notificações de webhook

## Comandos Úteis

### Verificar Status do Servidor
```bash
# Verificar se está rodando
lsof -i :3000

# Verificar logs
npm start
```

### Testar API do Mercado Pago
```bash
# Testar credenciais
curl -X GET "https://api.mercadopago.com/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Limpar Cache
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## Suporte

### Documentação Mercado Pago
- [API Reference](https://www.mercadopago.com.br/developers/reference)
- [SDK React](https://github.com/mercadopago/sdk-react)
- [Checkout API](https://www.mercadopago.com.br/developers/docs/checkout-api)

### Logs de Debug
Verifique o console do navegador para logs detalhados:
- Dados da preferência
- Status da resposta
- Erros específicos

### Contato
- Suporte técnico Mercado Pago
- Equipe de desenvolvimento MamaBoss 