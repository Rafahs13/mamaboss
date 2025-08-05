import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
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
  if (!isGoogleAuthConfigured()) {
    return null;
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