import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { Crown, Star, Zap, Check } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const PremiumBanner: React.FC = () => {
  const { currentPlan } = useSubscription();
  
  const bgGradient = useColorModeValue(
    'linear(135deg, #667eea 0%, #764ba2 100%)',
    'linear(135deg, #4c63d2 0%, #6b46c1 100%)'
  );

  // Se já tem plano premium, não mostrar o banner
  if (currentPlan?.id === 'pro' || currentPlan?.id === 'business') {
    return null;
  }

  const premiumFeatures = [
    'Tarefas ilimitadas',
    'Metas ilimitadas',
    'Cursos premium',
    'Suporte prioritário',
  ];

  return (
    <Box
      bgGradient={bgGradient}
      color="white"
      p={6}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3,
      }}
    >
      <VStack spacing={4} align="stretch" position="relative" zIndex={1}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2}>
            <HStack>
              <Crown size={24} color="#FFD700" />
              <Text fontSize="xl" fontWeight="bold">
                Desbloqueie o MamaBoss Premium
              </Text>
            </HStack>
            <Text fontSize="sm" opacity={0.9}>
              Aproveite todas as funcionalidades avançadas por apenas R$ 29,90/mês
            </Text>
          </VStack>
          <Badge colorScheme="yellow" fontSize="sm">
            <Star size={12} style={{ marginRight: '4px' }} />
            Mais Popular
          </Badge>
        </HStack>

        <HStack spacing={6} wrap="wrap">
          {premiumFeatures.map((feature, index) => (
            <HStack key={index} spacing={2}>
              <Check size={16} />
              <Text fontSize="sm">{feature}</Text>
            </HStack>
          ))}
        </HStack>

        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold">
                R$ 29,90
              </Text>
              <Text fontSize="sm" opacity={0.9}>
                /mês
              </Text>
            </HStack>
            <Text fontSize="xs" opacity={0.8}>
              Cancele a qualquer momento
            </Text>
          </VStack>
          <PremiumButton
            variant="solid"
            size="md"
            children="Assinar Premium"
            showIcon={true}
          />
        </HStack>
      </VStack>
    </Box>
  );
}; 