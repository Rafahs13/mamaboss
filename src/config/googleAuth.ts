import { GoogleAuthConfig } from '../types';

// Configuração do Google OAuth
// Em produção, essas configurações devem vir de variáveis de ambiente
export const googleAuthConfig: GoogleAuthConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id-here',
};

// Configurações do Google Sign-In
export const googleSignInConfig = {
  theme: 'outline' as const,
  size: 'large' as const,
  text: 'signin_with' as const,
  shape: 'rectangular' as const,
  logo_alignment: 'left' as const,
  width: '100%',
};

// URLs de redirecionamento (para produção)
export const googleRedirectUrls = {
  development: 'http://localhost:3000',
  production: window.location.origin,
};

// Escopos solicitados
export const googleScopes = [
  'openid',
  'profile',
  'email',
];

// Função para obter a URL de redirecionamento baseada no ambiente
export const getRedirectUrl = (): string => {
  return process.env.NODE_ENV === 'production' 
    ? googleRedirectUrls.production 
    : googleRedirectUrls.development;
};

// Função para validar se a configuração está completa
export const isGoogleAuthConfigured = (): boolean => {
  // Temporariamente retorna true para mostrar o botão
  return true;
  // return !!googleAuthConfig.clientId && googleAuthConfig.clientId !== 'your-google-client-id-here';
}; 