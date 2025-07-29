import React, { useState } from 'react';
import {
  Button,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { Crown, Star } from 'lucide-react';
import { PremiumModal } from './PremiumModal';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface PremiumButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'solid',
  size = 'md',
  children = 'Assinar Premium',
  showIcon = true,
  fullWidth = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentPlan } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const bgGradient = useColorModeValue(
    'linear(to-r, purple.400, pink.400)',
    'linear(to-r, purple.500, pink.500)'
  );

  const handleSuccess = () => {
    setIsUpgrading(true);
    // Recarregar a página para atualizar o status da assinatura
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // Se já tem plano premium, não mostrar o botão
  if (currentPlan?.id === 'pro' || currentPlan?.id === 'business') {
    return null;
  }

  return (
    <>
      <Button
        colorScheme="purple"
        variant={variant}
        size={size}
        onClick={onOpen}
        leftIcon={showIcon ? <Crown size={16} /> : undefined}
        bgGradient={variant === 'solid' ? bgGradient : undefined}
        _hover={{
          bgGradient: variant === 'solid' ? bgGradient : undefined,
          transform: 'translateY(-1px)',
          shadow: 'lg',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        transition="all 0.2s"
        w={fullWidth ? 'full' : 'auto'}
        position="relative"
        overflow="hidden"
      >
        {children}
        {showIcon && (
          <Star
            size={12}
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              color: '#FFD700',
            }}
          />
        )}
      </Button>

      <PremiumModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}; 