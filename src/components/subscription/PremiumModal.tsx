import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  Badge,
} from '@chakra-ui/react';
import {
  Crown,
  Check,
  CreditCard,
  Shield,
  Zap,
  Star,
  ArrowRight,
  X,
} from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { MERCADO_PAGO_CONFIG, getReturnUrls, getWebhookUrl, PRODUCTS } from '../../config/mercadopago';

// Inicializar Mercado Pago
initMercadoPago(MERCADO_PAGO_CONFIG.PUBLIC_KEY);

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PreferenceData {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
  notification_url?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletInitialization, setWalletInitialization] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Criar preferência de pagamento
  const createPreference = async (): Promise<string> => {
    const preferenceData: PreferenceData = {
      items: [
        {
          id: PRODUCTS.PREMIUM_MONTHLY.id,
          title: PRODUCTS.PREMIUM_MONTHLY.title,
          quantity: 1,
          unit_price: PRODUCTS.PREMIUM_MONTHLY.price,
          currency_id: PRODUCTS.PREMIUM_MONTHLY.currency,
        },
      ],
      back_urls: getReturnUrls(),
      auto_return: 'approved',
      external_reference: `user_${Date.now()}`,
      notification_url: getWebhookUrl(),
    };

          try {
        console.log('Criando preferência com dados:', preferenceData);
        
        const response = await fetch(`${MERCADO_PAGO_CONFIG.BASE_URL}/checkout/preferences`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceData),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro response:', errorText);
          throw new Error(`Erro ao criar preferência de pagamento: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Preferência criada:', data);
        return data.id;
      } catch (error) {
        console.error('Erro ao criar preferência:', error);
        throw new Error(error instanceof Error ? error.message : 'Não foi possível processar o pagamento');
      }
  };

  // Inicializar pagamento
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Para teste, vamos simular o pagamento primeiro
      console.log('Iniciando processo de pagamento...');
      
      // Simular criação de preferência (para teste)
      const mockPreferenceId = `test_pref_${Date.now()}`;
      console.log('Preferência simulada criada:', mockPreferenceId);
      
      setPreferenceId(mockPreferenceId);
      setWalletInitialization(true);
      
      // 🚀 PARA ATIVAR O MODO DE PRODUÇÃO:
      // 1. Comente as linhas acima (simulação)
      // 2. Descomente as linhas abaixo (produção)
      // 3. Configure as credenciais corretas no arquivo config/mercadopago.ts
      // 4. Configure webhooks para receber notificações
      // 
      // const preferenceId = await createPreference();
      // setPreferenceId(preferenceId);
      // setWalletInitialization(true);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o pagamento. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Lidar com sucesso do pagamento
  const handleSuccess = async () => {
    toast({
      title: 'Pagamento aprovado!',
      description: 'Sua assinatura premium foi ativada com sucesso!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onSuccess();
    onClose();
  };

  // Lidar com falha do pagamento
  const handleFailure = async () => {
    toast({
      title: 'Pagamento não aprovado',
      description: 'O pagamento não foi processado. Tente novamente.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  // Resetar estado quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setPreferenceId(null);
      setError(null);
      setWalletInitialization(false);
    }
  }, [isOpen]);

  const premiumFeatures = [
    'Tarefas ilimitadas',
    'Metas ilimitadas',
    'Calendário avançado',
    'Relatórios detalhados',
    'Cursos premium',
    'Suporte prioritário',
    'Backup automático',
    'Integração com apps',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
        <ModalHeader>
          <HStack>
            <Crown size={24} color="#FFD700" />
            <Text>Assinar MamaBoss Premium</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Card do Plano Premium */}
            <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Star size={20} />
                        <Text fontSize="xl" fontWeight="bold">
                          Plano Premium
                        </Text>
                      </HStack>
                      <Text fontSize="sm" opacity={0.9}>
                        Ideal para empreendedoras
                      </Text>
                    </VStack>
                    <Badge colorScheme="yellow" fontSize="sm">
                      Mais Popular
                    </Badge>
                  </HStack>

                  <HStack>
                    <Text fontSize="3xl" fontWeight="bold">
                      R$ 29,90
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      /mês
                    </Text>
                  </HStack>

                  <Divider borderColor="whiteAlpha.300" />

                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Inclui:
                    </Text>
                    {premiumFeatures.map((feature, index) => (
                      <HStack key={index} spacing={2}>
                        <Check size={16} />
                        <Text fontSize="sm">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Informações de Segurança */}
            <Alert status="info" borderRadius="md">
              <Shield size={16} />
              <Box>
                <AlertTitle>Pagamento Seguro</AlertTitle>
                <AlertDescription>
                  Seus dados são protegidos com criptografia SSL e processados pelo Mercado Pago.
                </AlertDescription>
              </Box>
            </Alert>

            {/* Erro */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Wallet do Mercado Pago ou Simulação */}
            {walletInitialization && preferenceId && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Escolha sua forma de pagamento:
                </Text>
                
                {/* Simulação para teste */}
                {preferenceId.startsWith('test_pref_') ? (
                  <VStack spacing={4} p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold">
                      🧪 Modo de Teste - Simulação de Pagamento
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Esta é uma simulação para teste. Em produção, o Wallet do Mercado Pago seria exibido aqui.
                    </Text>
                    
                    <HStack spacing={3}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={handleSuccess}
                        leftIcon={<Check size={16} />}
                      >
                        Simular Pagamento Aprovado
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={handleFailure}
                        leftIcon={<X size={16} />}
                      >
                        Simular Pagamento Rejeitado
                      </Button>
                    </HStack>
                    
                    <Text fontSize="xs" color="gray.500">
                      Preferência ID: {preferenceId}
                    </Text>
                  </VStack>
                ) : (
                  <Wallet
                    initialization={{ redirectMode: 'self' }}
                    onReady={() => console.log('Wallet ready')}
                    onSubmit={handleSuccess}
                    onError={handleFailure}
                  />
                )}
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            {!walletInitialization && (
              <Button
                colorScheme="blue"
                onClick={handlePayment}
                isLoading={isLoading}
                loadingText="Processando..."
                leftIcon={<CreditCard size={16} />}
                rightIcon={<ArrowRight size={16} />}
              >
                Assinar Premium
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 