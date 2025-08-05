# Configuração Rápida - Google OAuth 2.0

## ⚡ Configuração em 5 minutos

### 1. Obter Client ID do Google

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure:
   - **Application type**: Web application
   - **Name**: MamaBoss App
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000`
6. Copie o **Client ID** gerado

### 2. Configurar no Projeto

1. Crie um arquivo `.env` na raiz do projeto:
```bash
echo "REACT_APP_GOOGLE_CLIENT_ID=seu-client-id-aqui" > .env
```

2. Substitua `seu-client-id-aqui` pelo Client ID copiado

### 3. Testar

1. Execute `npm start`
2. Acesse http://localhost:3000/login
3. Você verá o botão "Entrar com Google"

## 🔧 Para Produção

1. No Google Cloud Console, adicione seu domínio real:
   - **Authorized JavaScript origins**: `https://seu-dominio.com`
   - **Authorized redirect URIs**: `https://seu-dominio.com`

2. Configure a variável de ambiente no seu servidor:
```env
REACT_APP_GOOGLE_CLIENT_ID=seu-client-id-producao
```

## 🚨 Problemas Comuns

### Botão não aparece
- Verifique se o arquivo `.env` existe
- Confirme se `REACT_APP_GOOGLE_CLIENT_ID` está configurado
- Reinicie o servidor após criar o `.env`

### Erro "popup_closed_by_user"
- Desative bloqueadores de popup
- Verifique se o domínio está autorizado

### Erro "access_denied"
- Usuário negou permissão
- Tente novamente

## 📞 Suporte

Se tiver problemas, consulte:
- [Documentação completa](GOOGLE_OAUTH_SETUP.md)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2) 