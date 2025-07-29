# Deploy no Vercel - MamaBoss

## 🚀 Configuração Automática

O projeto já está configurado para deploy automático no Vercel com:

- ✅ `vercel.json` - Configuração de build e rotas
- ✅ Variáveis de ambiente configuradas
- ✅ Webhook do Mercado Pago
- ✅ SPA routing configurado

## 📋 Passos para Deploy

### 1. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importe o repositório `mamaboss-app`

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
REACT_APP_MERCADO_PAGO_PUBLIC_KEY=APP_USR-907f81eb-e7af-40ca-8bb1-b1d5438afe95
REACT_APP_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4694434875461012-072819-94bdaadc61c4b5f5ad54c065bb4806e6-1763879487
REACT_APP_MERCADO_PAGO_CLIENT_ID=4694434875461012
REACT_APP_MERCADO_PAGO_CLIENT_SECRET=jGtL4UCGSfsBhZHPeabNYbWkkUab8Wcy
```

### 3. Configurar Build

O Vercel detectará automaticamente que é um projeto React e usará:

- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Configurar Domínio (Opcional)

1. Vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

## 🔧 Configurações Específicas

### Mercado Pago em Produção

1. **Ativar modo de produção**:
   - Edite `src/components/subscription/PremiumModal.tsx`
   - Comente as linhas de simulação
   - Descomente as linhas de produção

2. **Configurar webhook**:
   - No painel do Mercado Pago, adicione a URL do webhook:
   - `https://seu-dominio.vercel.app/api/webhook/mercadopago`

3. **Configurar URLs de retorno**:
   - Success: `https://seu-dominio.vercel.app/subscription?status=success`
   - Failure: `https://seu-dominio.vercel.app/subscription?status=failure`
   - Pending: `https://seu-dominio.vercel.app/subscription?status=pending`

### Configurações de Segurança

1. **CORS**: Configurado automaticamente pelo Vercel
2. **HTTPS**: Ativado automaticamente
3. **Headers de Segurança**: Configurados no `vercel.json`

## 📊 Monitoramento

### Logs do Vercel

- Acesse **Functions** no painel do Vercel
- Veja logs do webhook em tempo real
- Monitore erros e performance

### Analytics

- Integre com Google Analytics
- Configure eventos personalizados
- Monitore conversões de assinatura

## 🔄 Deploy Automático

### GitHub Integration

1. Conecte o repositório GitHub
2. Configure branch principal (`master`)
3. Deploy automático a cada push

### Preview Deployments

- Cada PR gera um preview
- Teste mudanças antes do merge
- URLs únicas para cada branch

## 🛠️ Troubleshooting

### Erro de Build

```bash
# Verificar logs
vercel logs

# Build local para teste
npm run build
```

### Erro de Webhook

1. Verificar logs em **Functions**
2. Testar endpoint manualmente
3. Verificar configuração do Mercado Pago

### Problemas de CORS

- Configurado automaticamente pelo Vercel
- Verificar `vercel.json` se necessário

## 📱 PWA Configuration

O projeto está configurado como PWA:

- ✅ Service Worker
- ✅ Manifest
- ✅ Offline support
- ✅ Install prompt

## 🔐 Segurança

### Variáveis de Ambiente

- Nunca commitar credenciais
- Usar variáveis do Vercel
- Rotacionar tokens regularmente

### Mercado Pago

- Usar credenciais de produção
- Configurar webhooks seguros
- Validar assinaturas

## 📈 Performance

### Otimizações Automáticas

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ CDN global

### Monitoramento

- Core Web Vitals
- Lighthouse scores
- Real user metrics

## 🎯 Próximos Passos

1. **Deploy inicial**: Conectar repositório ao Vercel
2. **Configurar domínio**: Adicionar domínio personalizado
3. **Ativar produção**: Configurar Mercado Pago para produção
4. **Monitorar**: Configurar alertas e analytics
5. **Otimizar**: Ajustar performance conforme necessário

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [React Documentation](https://reactjs.org/docs)

---

**Status**: ✅ Pronto para deploy
**Última atualização**: $(date) 