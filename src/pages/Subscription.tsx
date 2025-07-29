import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Divider,
  IconButton,
  Tooltip,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Check,
  CreditCard,
  DollarSign,
  Calendar,
  Shield,
  Star,
  Crown,
  Zap,
  Users,
  Settings as SettingsIcon,
  ArrowRight,
  X,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { PaymentForm } from '../types';
import { formatCurrency } from '../utils/formatters';
import { PremiumButton } from '../components/subscription/PremiumButton';

interface PlanCardProps {
  plan: any;
  isCurrent?: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrent, onSelect }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popularBg = useColorModeValue('blue.50', 'blue.900');
  const popularBorder = useColorModeValue('blue.200', 'blue.600');

  return (
    <Card
      bg={bgColor}
      border="1px"
      borderColor={plan.isPopular ? popularBorder : borderColor}
      position="relative"
      overflow="hidden"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      transition="all 0.2s"
    >
      {plan.isPopular && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bg={popularBg}
          color="blue.600"
          textAlign="center"
          py={1}
          fontSize="sm"
          fontWeight="bold"
        >
          <Star size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Mais Popular
        </Box>
      )}

      {isCurrent && (
        <Box
          position="absolute"
          top={plan.isPopular ? 8 : 0}
          right={0}
          bg="green.500"
          color="white"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          borderBottomLeftRadius="md"
        >
          Atual
        </Box>
      )}

      <CardHeader pb={2}>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">{plan.name}</Heading>
            {plan.id === 'business' && <Crown size={20} color="#FFD700" />}
            {plan.id === 'pro' && <Zap size={20} color="#FF6B35" />}
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {plan.description}
          </Text>
          <HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {plan.price === 0 ? 'Grátis' : formatCurrency(plan.price)}
            </Text>
            {plan.price > 0 && (
              <Text color="gray.500" fontSize="sm">
                /mês
              </Text>
            )}
          </HStack>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          <List spacing={2}>
            {plan.features.map((feature: string, index: number) => (
              <ListItem key={index} display="flex" alignItems="center">
                <ListIcon as={Check} color="green.500" />
                <Text fontSize="sm">{feature}</Text>
              </ListItem>
            ))}
          </List>

          <Button
            colorScheme={plan.isPopular ? 'blue' : 'gray'}
            variant={isCurrent ? 'outline' : 'solid'}
            size="lg"
            onClick={() => onSelect(plan.id)}
            isDisabled={isCurrent}
            leftIcon={isCurrent ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
          >
            {isCurrent ? 'Plano Atual' : plan.price === 0 ? 'Continuar Grátis' : 'Assinar Agora'}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onConfirm: (paymentData: PaymentForm) => void;
  isLoading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onConfirm,
  isLoading,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentForm>({
    planId: plan?.id || '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentData.paymentMethod === 'credit_card') {
      if (!paymentData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!paymentData.cardHolderName) newErrors.cardHolderName = 'Nome do titular é obrigatório';
      if (!paymentData.cardExpiry) newErrors.cardExpiry = 'Data de validade é obrigatória';
      if (!paymentData.cardCvv) newErrors.cardCvv = 'CVV é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(paymentData);
    }
  };

  const handleClose = () => {
    setPaymentData({
      planId: plan?.id || '',
      paymentMethod: 'credit_card',
      cardNumber: '',
      cardHolderName: '',
      cardExpiry: '',
      cardCvv: '',
      installments: 1,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <CreditCard size={20} />
            <Text>Finalizar Assinatura - {plan?.name}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Resumo do plano */}
            <Card bg="blue.50" border="1px" borderColor="blue.200">
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{plan?.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {plan?.description}
                    </Text>
                  </VStack>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {formatCurrency(plan?.price || 0)}
                  </Text>
                </HStack>
              </CardBody>
            </Card>

            {/* Método de pagamento */}
            <FormControl>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
              >
                <option value="credit_card">💳 Cartão de Crédito</option>
                <option value="debit_card">🏦 Cartão de Débito</option>
                <option value="pix">📱 PIX</option>
                <option value="boleto">📄 Boleto Bancário</option>
              </Select>
            </FormControl>

            {/* Campos do cartão */}
            {paymentData.paymentMethod === 'credit_card' && (
              <>
                <FormControl isInvalid={!!errors.cardNumber}>
                  <FormLabel>Número do Cartão</FormLabel>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.cardHolderName}>
                  <FormLabel>Nome do Titular</FormLabel>
                  <Input
                    placeholder="Nome como está no cartão"
                    value={paymentData.cardHolderName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardHolderName: e.target.value })}
                  />
                </FormControl>

                <HStack>
                  <FormControl isInvalid={!!errors.cardExpiry}>
                    <FormLabel>Validade</FormLabel>
                    <Input
                      placeholder="MM/AA"
                      value={paymentData.cardExpiry}
                      onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isInvalid={!!errors.cardCvv}>
                    <FormLabel>CVV</FormLabel>
                    <Input
                      placeholder="123"
                      value={paymentData.cardCvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cardCvv: e.target.value })}
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Parcelas</FormLabel>
                  <Select
                    value={paymentData.installments}
                    onChange={(e) => setPaymentData({ ...paymentData, installments: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>
                        {num}x de {formatCurrency((plan?.price || 0) / num)}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {/* Informações de segurança */}
            <Alert status="info" borderRadius="md">
              <Shield size={16} />
              <Box>
                <AlertTitle>Pagamento Seguro</AlertTitle>
                <AlertDescription>
                  Seus dados são protegidos com criptografia SSL e processados pelo Mercado Pago.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Processando..."
            leftIcon={<CreditCard size={16} />}
          >
            Finalizar Pagamento
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Subscription: React.FC = () => {
  const {
    plans,
    currentPlan,
    subscribeToPlan,
    cancelSubscription,
    getTransactionHistory,
    isLoading,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handlePlanSelect = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = async (paymentData: PaymentForm) => {
    setProcessingPayment(true);
    
    try {
      const success = await subscribeToPlan(selectedPlan.id, paymentData);
      
      if (success) {
        toast({
          title: 'Assinatura ativada!',
          description: `Você agora tem acesso ao plano ${selectedPlan.name}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setShowPaymentModal(false);
      } else {
        toast({
          title: 'Erro no pagamento',
          description: 'Não foi possível processar o pagamento. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    setProcessingCancel(true);
    
    try {
      const success = await cancelSubscription();
      
      if (success) {
        toast({
          title: 'Assinatura cancelada',
          description: 'Sua assinatura foi cancelada com sucesso.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        setShowCancelModal(false);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível cancelar a assinatura.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessingCancel(false);
    }
  };

  const transactions = getTransactionHistory();

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="lg">Escolha seu Plano</Heading>
            <Text color="gray.600" maxW="2xl">
              Desbloqueie todo o potencial do MamaBoss com nossos planos premium. 
              Escolha o que melhor se adapta às suas necessidades.
            </Text>
            <PremiumButton size="lg" fullWidth={false} />
          </VStack>

          {/* Plano atual */}
          {currentPlan && (
            <Card bg="green.50" border="1px" borderColor="green.200">
              <CardBody>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <CheckCircle size={20} color="green" />
                      <Text fontWeight="bold">Plano Atual: {currentPlan.name}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Você tem acesso a todas as funcionalidades deste plano
                    </Text>
                  </VStack>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                    leftIcon={<X size={16} />}
                  >
                    Cancelar Assinatura
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Planos */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {plans.map((plan) => (
              <GridItem key={plan.id}>
                <PlanCard
                  plan={plan}
                  isCurrent={currentPlan?.id === plan.id}
                  onSelect={handlePlanSelect}
                />
              </GridItem>
            ))}
          </Grid>

          {/* Histórico de transações */}
          {transactions.length > 0 && (
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Histórico de Transações</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {transactions.slice(0, 5).map((transaction) => (
                    <HStack key={transaction.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">
                          {plans.find(p => p.id === transaction.planId)?.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold" color="green.500">
                          {formatCurrency(transaction.amount)}
                        </Text>
                        <Badge
                          colorScheme={
                            transaction.status === 'approved' ? 'green' :
                            transaction.status === 'pending' ? 'yellow' : 'red'
                          }
                        >
                          {transaction.status === 'approved' ? 'Aprovado' :
                           transaction.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                        </Badge>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Modal de pagamento */}
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            plan={selectedPlan}
            onConfirm={handlePaymentConfirm}
            isLoading={processingPayment}
          />

          {/* Modal de cancelamento */}
          <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Cancelar Assinatura</ModalHeader>
              <ModalBody>
                <Alert status="warning" borderRadius="md">
                  <AlertTriangle size={16} />
                  <Box>
                    <AlertTitle>Atenção!</AlertTitle>
                    <AlertDescription>
                      Tem certeza que deseja cancelar sua assinatura? Você perderá acesso às funcionalidades premium.
                    </AlertDescription>
                  </Box>
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={() => setShowCancelModal(false)}>
                  Manter Assinatura
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleCancelSubscription}
                  isLoading={processingCancel}
                  loadingText="Cancelando..."
                >
                  Confirmar Cancelamento
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
}; 