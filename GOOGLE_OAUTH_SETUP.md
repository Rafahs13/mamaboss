# Configuração do Google OAuth 2.0

Este documento explica como configurar o login via Google OAuth 2.0 no sistema MamaBoss.

## Pré-requisitos

1. Uma conta Google
2. Acesso ao Google Cloud Console
3. Domínio configurado (para produção)

## Passos para Configuração

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (se necessário)

### 2. Configurar OAuth 2.0

1. No menu lateral, vá para **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure o tipo de aplicação:
   - **Application type**: Web application
   - **Name**: MamaBoss App
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)

### 3. Obter Client ID

Após criar as credenciais, você receberá um **Client ID**. Copie este valor.

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_GOOGLE_CLIENT_ID=seu-client-id-aqui
```

**Importante**: Nunca commite o arquivo `.env` no repositório. Adicione-o ao `.gitignore`.

### 5. Configurar para Produção

Para produção, você precisará:

1. Adicionar seu domínio real nas **Authorized JavaScript origins**
2. Configurar a variável de ambiente `REACT_APP_GOOGLE_CLIENT_ID` no seu servidor
3. Atualizar a URL de redirecionamento em `src/config/googleAuth.ts`

## Funcionalidades Implementadas

### ✅ Login com Google
- Botão de login do Google na tela de login
- Autenticação via OAuth 2.0
- Decodificação do token JWT do Google

### ✅ Gerenciamento de Usuários
- Criação automática de usuário se não existir
- Atualização de dados do usuário existente
- Verificação de email duplicado

### ✅ Segurança
- Validação de token
- Verificação de expiração
- Armazenamento seguro de dados

### ✅ UX/UI
- Botão seguindo as diretrizes do Google
- Feedback visual durante o processo
- Tratamento de erros

## Estrutura de Arquivos

```
src/
├── config/
│   └── googleAuth.ts          # Configurações do Google OAuth
├── services/
│   └── googleAuthService.ts   # Serviço de autenticação Google
├── contexts/
│   └── AuthContext.tsx        # Contexto de autenticação (atualizado)
├── pages/
│   └── Login.tsx              # Página de login (atualizada)
└── types/
    └── index.ts               # Tipos TypeScript (atualizado)
```

## Fluxo de Autenticação

1. **Usuário clica no botão "Entrar com Google"**
2. **Google abre popup de autenticação**
3. **Usuário faz login no Google**
4. **Google retorna token JWT**
5. **Sistema decodifica o token**
6. **Verifica se usuário existe no sistema**
7. **Cria ou atualiza usuário**
8. **Redireciona para dashboard**

## Tratamento de Erros

O sistema trata os seguintes erros:

- **Token inválido**: Token malformado ou expirado
- **Credencial não fornecida**: Falha na autenticação Google
- **Erro de rede**: Problemas de conectividade
- **Usuário cancelou**: Usuário fechou popup do Google

## Personalização

### Estilo do Botão

O botão do Google pode ser personalizado editando as propriedades em `src/config/googleAuth.ts`:

```typescript
export const googleSignInConfig = {
  theme: 'outline',           // 'outline' | 'filled_blue' | 'filled_black'
  size: 'large',              // 'large' | 'medium' | 'small'
  text: 'signin_with',        // 'signin_with' | 'signup_with' | 'continue_with'
  shape: 'rectangular',       // 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment: 'left',     // 'left' | 'center'
  width: '100%',
};
```

### Escopos Adicionais

Para solicitar permissões adicionais, edite `src/config/googleAuth.ts`:

```typescript
export const googleScopes = [
  'openid',
  'profile',
  'email',
  // Adicione outros escopos conforme necessário
];
```

## Troubleshooting

### Botão não aparece
- Verifique se `REACT_APP_GOOGLE_CLIENT_ID` está configurado
- Confirme se o domínio está nas origens autorizadas

### Erro "popup_closed_by_user"
- Usuário fechou o popup do Google
- Verifique bloqueadores de popup

### Erro "access_denied"
- Usuário negou permissão
- Verifique os escopos solicitados

### Token inválido
- Verifique se o Client ID está correto
- Confirme se o domínio está autorizado

## Segurança

### Boas Práticas

1. **Nunca exponha o Client Secret** no frontend
2. **Valide sempre o token** no backend
3. **Use HTTPS** em produção
4. **Configure corretamente** as origens autorizadas
5. **Monitore** tentativas de login

### Validação de Token

O sistema valida automaticamente:
- Formato do token JWT
- Expiração do token
- Assinatura do token (quando possível)

## Próximos Passos

Para uma implementação completa em produção, considere:

1. **Backend API** para validação de tokens
2. **Banco de dados** para armazenar usuários
3. **Refresh tokens** para renovação automática
4. **Logout** do Google
5. **Revogação** de tokens
6. **Auditoria** de login

## Suporte

Para dúvidas ou problemas:

1. Verifique a [documentação oficial do Google](https://developers.google.com/identity/protocols/oauth2)
2. Consulte os [logs do console](https://console.cloud.google.com/)
3. Teste em modo de desenvolvimento primeiro 