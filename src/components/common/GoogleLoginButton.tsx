import React from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { isGoogleAuthConfigured } from '../../config/googleAuth';

interface GoogleLoginButtonProps {
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
  showDivider?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  showDivider = true,
}) => {
  console.log('GoogleLoginButton renderizado, isGoogleAuthConfigured:', isGoogleAuthConfigured());
  
  if (!isGoogleAuthConfigured()) {
    console.log('Google OAuth não configurado, mostrando botão de fallback');
    return (
      <VStack spacing={4}>
        {showDivider && (
          <Text color="gray.600" fontSize="sm">
            Ou entre com
          </Text>
        )}
        <Button
          w="full"
          colorScheme="red"
          variant="outline"
          onClick={() => {
            console.log('Botão Google clicado (fallback)');
            onError();
          }}
        >
          🔐 Login com Google (Configurar OAuth)
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={4}>
      {showDivider && (
        <Text color="gray.600" fontSize="sm">
          Ou entre com
        </Text>
      )}
      <Box w="full">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
          width="100%"
        />
      </Box>
    </VStack>
  );
}; 