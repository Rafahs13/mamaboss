import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Badge,
  IconButton,
  Flex,
  useToast,
  Card,
  CardBody,
  Grid,
  GridItem,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  Alert,
  AlertIcon,
  Tooltip,
  Switch,
  FormHelperText,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  Download,
  PieChart,
  BarChart3,
  Wallet,
  Briefcase,
  Home,
  CreditCard,
  ShoppingCart,
  Car,
  Heart,
  BookOpen,
  Utensils,
  Wifi,
  Zap,
} from 'lucide-react';
import { Finance, FinanceForm } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useFinances } from '../contexts/FinanceContext';

// Categorias de despesas
const EXPENSE_CATEGORIES = [
  { value: 'alimentacao', label: 'Alimentação', icon: <Utensils size={16} /> },
  { value: 'transporte', label: 'Transporte', icon: <Car size={16} /> },
  { value: 'moradia', label: 'Moradia', icon: <Home size={16} /> },
  { value: 'saude', label: 'Saúde', icon: <Heart size={16} /> },
  { value: 'educacao', label: 'Educação', icon: <BookOpen size={16} /> },
  { value: 'lazer', label: 'Lazer', icon: <Heart size={16} /> },
  { value: 'servicos', label: 'Serviços', icon: <Wifi size={16} /> },
  { value: 'energia', label: 'Energia', icon: <Zap size={16} /> },
  { value: 'outros', label: 'Outros', icon: <ShoppingCart size={16} /> },
];

// Categorias de receitas
const INCOME_CATEGORIES = [
  { value: 'salario', label: 'Salário', icon: <DollarSign size={16} /> },
  { value: 'freelance', label: 'Freelance', icon: <Briefcase size={16} /> },
  { value: 'investimentos', label: 'Investimentos', icon: <TrendingUp size={16} /> },
  { value: 'vendas', label: 'Vendas', icon: <ShoppingCart size={16} /> },
  { value: 'presentes', label: 'Presentes', icon: <Heart size={16} /> },
  { value: 'outros', label: 'Outros', icon: <DollarSign size={16} /> },
];

// Funções auxiliares
const getCategoryIcon = (category: string) => {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = allCategories.find(cat => cat.value === category);
  return found ? found.icon : <DollarSign size={16} />;
};

const getCategoryLabel = (category: string) => {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const found = allCategories.find(cat => cat.value === category);
  return found ? found.label : category;
};

const getTypeColor = (type: string) => {
  return type === 'receita' ? 'green' : 'red';
};

const getTypeIcon = (type: string) => {
  return type === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
};

// Componente de estatísticas
const FinanceStats: React.FC<{
  stats: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    businessIncome: number;
    businessExpenses: number;
    personalIncome: number;
    personalExpenses: number;
  };
}> = ({ stats }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Saldo Total</StatLabel>
            <StatNumber color={stats.balance >= 0 ? 'green.500' : 'red.500'}>
              {formatCurrency(stats.balance)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={stats.balance >= 0 ? 'increase' : 'decrease'} />
              {stats.balance >= 0 ? 'Positivo' : 'Negativo'}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Receitas</StatLabel>
            <StatNumber color="green.500">
              {formatCurrency(stats.totalIncome)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.totalIncome > 0 ? 'Este mês' : 'Nenhuma receita'}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Despesas</StatLabel>
            <StatNumber color="red.500">
              {formatCurrency(stats.totalExpenses)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {stats.totalExpenses > 0 ? 'Este mês' : 'Nenhuma despesa'}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Negócio</StatLabel>
            <StatNumber color="blue.500">
              {formatCurrency(stats.businessIncome - stats.businessExpenses)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={stats.businessIncome - stats.businessExpenses >= 0 ? 'increase' : 'decrease'} />
              {stats.businessIncome - stats.businessExpenses >= 0 ? 'Lucro' : 'Prejuízo'}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Grid>
  );
};

// Componente de lista de transações
const TransactionList: React.FC<{
  transactions: Finance[];
  onEdit: (transaction: Finance) => void;
  onDelete: (id: string) => void;
}> = ({ transactions, onEdit, onDelete }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (transactions.length === 0) {
    return (
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={4} py={8}>
            <Wallet size={48} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              Nenhuma transação encontrada
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      {transactions.map((transaction) => (
        <Card key={transaction.id} bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center">
              <HStack spacing={3} flex={1}>
                <Box
                  p={2}
                  bg={`${getTypeColor(transaction.type)}.100`}
                  borderRadius="md"
                  color={`${getTypeColor(transaction.type)}.600`}
                >
                  {getTypeIcon(transaction.type)}
                </Box>
                
                <VStack align="start" spacing={1} flex={1}>
                  <HStack spacing={2}>
                    <Text fontWeight="bold" fontSize="md">
                      {transaction.description}
                    </Text>
                    <Badge colorScheme={getTypeColor(transaction.type)} size="sm">
                      {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                    </Badge>
                    <Badge colorScheme={transaction.isBusiness ? 'blue' : 'purple'} size="sm">
                      {transaction.isBusiness ? 'Negócio' : 'Pessoal'}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={2} color="gray.600">
                    <Text fontSize="sm">
                      {getCategoryIcon(transaction.category)} {getCategoryLabel(transaction.category)}
                    </Text>
                    <Text fontSize="sm">
                      <Calendar size={12} /> {formatDate(transaction.date)}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <VStack align="end" spacing={1}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={getTypeColor(transaction.type) + '.500'}
                >
                  {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
                
                <HStack spacing={1}>
                  <Tooltip label="Editar transação">
                    <IconButton
                      aria-label="Editar transação"
                      icon={<Edit size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(transaction)}
                    />
                  </Tooltip>
                  <Tooltip label="Excluir transação">
                    <IconButton
                      aria-label="Excluir transação"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete(transaction.id)}
                    />
                  </Tooltip>
                </HStack>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

// Modal de transação
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Finance | null;
  onSubmit: (transactionData: FinanceForm) => void;
  isSubmitting: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
  isSubmitting,
}) => {
  const [form, setForm] = useState<FinanceForm>({
    type: 'despesa',
    category: 'outros',
    amount: 0,
    description: '',
    date: new Date(),
    isBusiness: false,
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(transaction.date),
        isBusiness: transaction.isBusiness,
      });
    } else {
      setForm({
        type: 'despesa',
        category: 'outros',
        amount: 0,
        description: '',
        date: new Date(),
        isBusiness: false,
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const categories = form.type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'receita' | 'despesa',
                      category: 'outros' // Reset category when type changes
                    }))}
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Valor</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0,00"
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da transação"
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Data</FormLabel>
                  <Input
                    type="date"
                    value={form.date.toISOString().split('T')[0]}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      date: e.target.value ? new Date(e.target.value) : new Date()
                    }))}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Transação do Negócio</FormLabel>
                <Switch
                  isChecked={form.isBusiness}
                  onChange={(e) => setForm(prev => ({ ...prev, isBusiness: e.target.checked }))}
                />
                <FormHelperText>
                  Marque se esta transação é relacionada ao seu negócio
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Salvando..."
            >
              {transaction ? 'Atualizar' : 'Criar'} Transação
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Página principal de finanças
export const Finances: React.FC = () => {
  const { 
    finances, 
    addFinance, 
    updateFinance, 
    deleteFinance, 
    getFinancesByMonth,
    getMonthlyStats,
    isLoading 
  } = useFinances();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBusiness, setFilterBusiness] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Finance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Obter estatísticas do mês atual
  const currentStats = getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth());

  // Filtros
  const filteredTransactions = finances.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesBusiness = filterBusiness === 'all' || 
      (filterBusiness === 'business' && transaction.isBusiness) ||
      (filterBusiness === 'personal' && !transaction.isBusiness);
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesBusiness && matchesSearch;
  });

  // Manipulação de transações
  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    onOpen();
  };

  const handleEditTransaction = (transaction: Finance) => {
    setEditingTransaction(transaction);
    onOpen();
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      deleteFinance(id);
      toast({
        title: 'Transação excluída',
        description: 'A transação foi removida com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a transação.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitTransaction = async (transactionData: FinanceForm) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        updateFinance(editingTransaction.id, transactionData);
        toast({
          title: 'Transação atualizada',
          description: 'A transação foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        addFinance(transactionData);
        toast({
          title: 'Transação criada',
          description: 'A transação foi criada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a transação.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <VStack spacing={4} py={8}>
          <Text>Carregando finanças...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Finanças</Heading>
            <Text color="gray.600">
              Controle suas finanças pessoais e do negócio
            </Text>
          </VStack>
          <Button
            colorScheme="purple"
            leftIcon={<Plus size={16} />}
            onClick={handleCreateTransaction}
          >
            Nova Transação
          </Button>
        </Flex>

        {/* Estatísticas */}
        <FinanceStats stats={currentStats} />

        {/* Filtros */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                gap={4} 
                w="full" 
                justify="space-between"
              >
                <HStack spacing={4}>
                  <FormControl maxW="150px">
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      size="sm"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="receita">Receitas</option>
                      <option value="despesa">Despesas</option>
                    </Select>
                  </FormControl>

                  <FormControl maxW="150px">
                    <Select
                      value={filterBusiness}
                      onChange={(e) => setFilterBusiness(e.target.value)}
                      size="sm"
                    >
                      <option value="all">Todos</option>
                      <option value="business">Negócio</option>
                      <option value="personal">Pessoal</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl maxW="300px">
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="sm"
                  />
                </FormControl>
              </Flex>
            </VStack>
          </CardBody>
        </Card>

        {/* Lista de Transações */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md">Transações</Heading>
                <Text color="gray.600" fontSize="sm">
                  {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? 'ões' : ''}
                </Text>
              </Flex>

              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Modal de transação */}
        <TransactionModal
          isOpen={isOpen}
          onClose={onClose}
          transaction={editingTransaction}
          onSubmit={handleSubmitTransaction}
          isSubmitting={isSubmitting}
        />
      </VStack>
    </Box>
  );
}; 