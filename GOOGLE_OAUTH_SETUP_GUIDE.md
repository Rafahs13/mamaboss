# 🔐 Configuração do Google OAuth - MamaBoss

## 🎯 **Objetivo**
Configurar o login com Google para o MamaBoss funcionar corretamente.

## 📋 **Passo a Passo**

### **1. Criar Projeto no Google Cloud Console**

1. **Acesse**: https://console.cloud.google.com/
2. **Crie um novo projeto** ou selecione um existente
3. **Nome do projeto**: `mamaboss-app` (ou similar)

### **2. Ativar Google+ API**

1. Vá em **APIs & Services** > **Library**
2. Procure por **"Google+ API"** ou **"Google Identity"**
3. Clique em **Enable**

### **3. Criar Credenciais OAuth 2.0**

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. Configure:
   - **Application type**: Web application
   - **Name**: MamaBoss Web App
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://seu-site.netlify.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000
     https://seu-site.netlify.app
     ```

### **4. Copiar Client ID**

Após criar, você receberá um **Client ID** como:
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### **5. Configurar no Projeto**

#### **Para Desenvolvimento Local**
```bash
# Criar arquivo .env na raiz do projeto
echo "REACT_APP_GOOGLE_CLIENT_ID=seu-client-id-aqui" > .env
```

#### **Para Produção (Netlify)**
1. No Netlify, vá em **Site settings** > **Environment variables**
2. Adicione:
   - **Key**: `REACT_APP_GOOGLE_CLIENT_ID`
   - **Value**: `seu-client-id-aqui`

## 🔧 **Configuração Rápida (Temporária)**

Se você quiser testar rapidamente, pode usar um Client ID de teste:

```bash
# Criar .env temporário
echo "REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com" > .env
```

## 🚀 **Testar**

1. **Reinicie o servidor**:
   ```bash
   npm start
   ```

2. **Acesse**: http://localhost:3000/login

3. **Verifique se o botão do Google aparece**

## 🎯 **URLs para Configurar**

### **Desenvolvimento**
- **JavaScript origins**: `http://localhost:3000`
- **Redirect URIs**: `http://localhost:3000`

### **Produção (Netlify)**
- **JavaScript origins**: `https://seu-site.netlify.app`
- **Redirect URIs**: `https://seu-site.netlify.app`

## 🚨 **Troubleshooting**

### **Botão não aparece**
- Verifique se `REACT_APP_GOOGLE_CLIENT_ID` está configurado
- Confirme se o arquivo `.env` está na raiz do projeto
- Reinicie o servidor após criar o `.env`

### **Erro de origem não autorizada**
- Adicione `http://localhost:3000` nas origens autorizadas
- Para produção, adicione seu domínio Netlify

### **Erro de redirecionamento**
- Configure as URIs de redirecionamento corretamente
- Use HTTPS para produção

## 📞 **Suporte**

Se precisar de ajuda:
1. Verifique os logs do console do navegador
2. Confirme se as APIs estão ativadas no Google Console
3. Teste com diferentes navegadores

---

**🎉 Após configurar, o login com Google funcionará perfeitamente!** 