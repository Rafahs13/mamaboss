import React from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Carregando...', 
  size = 'lg' 
}) => {
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="200px"
      w="full"
    >
      <VStack spacing={4}>
        <VStack spacing={2}>
          <Heart size={32} color="#ec4899" />
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="pink.500"
            size={size}
          />
        </VStack>
        <Text color={textColor} fontSize="sm">
          {message}
        </Text>
      </VStack>
    </Box>
  );
}; 