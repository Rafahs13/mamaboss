# 🔧 Configuração do Client ID do Google

## ❌ Problema Atual
- **Erro**: 401 invalid_client
- **Causa**: Client ID temporário inválido
- **Solução**: Criar Client ID real no Google Cloud Console

## 🚀 Passo a Passo para Obter Client ID Real

### 1. Acessar Google Cloud Console
1. Abra: https://console.cloud.google.com/
2. Faça login com sua conta Google

### 2. Criar ou Selecionar Projeto
1. No topo da página, clique no seletor de projetos
2. Clique em **"Novo Projeto"** ou selecione um existente
3. Dê um nome como "MamaBoss App"
4. Clique em **"Criar"**

### 3. Ativar APIs Necessárias
1. No menu lateral, vá em **"APIs & Services"** > **"Library"**
2. Procure e ative:
   - **Google+ API** (se disponível)
   - **Google Identity** (se disponível)

### 4. Criar Credenciais OAuth 2.0
1. No menu lateral, vá em **"APIs & Services"** > **"Credentials"**
2. Clique em **"Create Credentials"** > **"OAuth 2.0 Client IDs"**

### 5. Configurar OAuth Consent Screen
Se for a primeira vez:
1. Selecione **"External"** (para desenvolvimento)
2. Preencha as informações:
   - **App name**: MamaBoss
   - **User support email**: seu-email@gmail.com
   - **Developer contact information**: seu-email@gmail.com
3. Clique em **"Save and Continue"**
4. Em **Scopes**, clique em **"Save and Continue"**
5. Em **Test users**, adicione seu email e clique em **"Save and Continue"**

### 6. Criar Client ID
1. **Application type**: Web application
2. **Name**: MamaBoss Web Client
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000
   ```
5. Clique em **"Create"**

### 7. Copiar Client ID
1. Após criar, você verá uma tela com o **Client ID**
2. Copie o Client ID (algo como: `123456789-abcdef.apps.googleusercontent.com`)

## 🔄 Atualizar o Projeto

### 1. Atualizar arquivo .env
```bash
# Substitua o Client ID temporário pelo real
echo "REACT_APP_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_REAL_AQUI" > .env
```

### 2. Reiniciar o servidor
```bash
# Pare o servidor atual (Ctrl+C)
# Inicie novamente
npm start
```

## ✅ Verificação

Após configurar:
1. Acesse: http://localhost:3000/login
2. Clique no botão "Entrar com Google"
3. Deve abrir o popup do Google
4. Faça login com sua conta Google
5. Deve redirecionar para o dashboard

## 🚨 Troubleshooting

### Erro "popup_closed_by_user"
- Desative bloqueadores de popup
- Verifique se o domínio está autorizado

### Erro "access_denied"
- Verifique se seu email está na lista de test users
- Confirme se você aceitou as permissões

### Erro "invalid_client"
- Verifique se o Client ID está correto no .env
- Confirme se reiniciou o servidor após atualizar o .env

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do console do navegador
2. Confirme se todas as URLs estão corretas
3. Teste com uma conta Google diferente 