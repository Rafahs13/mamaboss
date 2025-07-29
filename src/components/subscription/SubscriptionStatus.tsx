import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Crown, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export const SubscriptionStatus: React.FC = () => {
  const { currentPlan, subscription } = useSubscription();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!subscription || !currentPlan) {
    return (
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <HStack>
                <Crown size={20} color="#FFD700" />
                <Text fontWeight="bold">Status da Assinatura</Text>
              </HStack>
              <Badge colorScheme="gray">Gratuito</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Você está usando o plano gratuito
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => navigate('/subscription')}
              leftIcon={<Crown size={16} />}
            >
              Ver Planos
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'expired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (subscription.status) {
      case 'active':
        return 'Ativa';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      case 'expired':
        return 'Expirada';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'pending':
        return <AlertTriangle size={16} />;
      case 'cancelled':
      case 'expired':
        return <AlertTriangle size={16} />;
      default:
        return <Crown size={16} />;
    }
  };

  const daysUntilExpiry = Math.ceil(
    (subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <HStack>
              {currentPlan.id === 'business' ? (
                <Crown size={20} color="#FFD700" />
              ) : (
                <Zap size={20} color="#FF6B35" />
              )}
              <Text fontWeight="bold">Status da Assinatura</Text>
            </HStack>
            <Badge colorScheme={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </HStack>
          
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">{currentPlan.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {currentPlan.description}
            </Text>
          </VStack>

          {subscription.status === 'active' && (
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.600">
                Renovação automática: {subscription.autoRenew ? 'Ativada' : 'Desativada'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Expira em: {daysUntilExpiry} dias
              </Text>
            </VStack>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/subscription')}
            leftIcon={getStatusIcon()}
          >
            Gerenciar Assinatura
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}; 