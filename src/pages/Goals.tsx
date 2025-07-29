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
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Alert,
  AlertIcon,
  Progress,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  Target,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Goal, GoalForm } from '../types';
import { formatDate, formatRelativeDate, formatPercentage } from '../utils/formatters';
import { useGoals } from '../contexts/GoalContext';

// Funções auxiliares
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativa': return 'blue';
    case 'concluida': return 'green';
    case 'pausada': return 'orange';
    default: return 'gray';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'trabalho': return '💼';
    case 'familia': return '👨‍👩‍👧‍👦';
    case 'pessoal': return '❤️';
    case 'financeiro': return '💰';
    case 'saude': return '🏃‍♀️';
    default: return '🎯';
  }
};

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, updateProgress } = useGoals();
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    filterGoals();
  }, [goals, searchTerm, selectedCategory, selectedStatus]);

  const filterGoals = () => {
    let filtered = goals;

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === selectedCategory);
    }

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(goal => goal.status === selectedStatus);
    }

    setFilteredGoals(filtered);
  };

  const handleSubmit = async (formData: GoalForm) => {
    setIsSubmitting(true);
    try {
      if (editingGoal) {
        // Editar meta existente
        updateGoal(editingGoal.id, formData);
        toast({
          title: 'Meta atualizada!',
          description: 'Sua meta foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Criar nova meta
        addGoal(formData);
        toast({
          title: 'Meta criada!',
          description: 'Nova meta adicionada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      setEditingGoal(null);
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Ocorreu um erro ao salvar a meta.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (goalId: string) => {
    deleteGoal(goalId);
    toast({
      title: 'Meta removida!',
      description: 'A meta foi removida com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleProgressChange = (goalId: string, progress: number) => {
    updateProgress(goalId, progress);
    toast({
      title: 'Progresso atualizado!',
      description: `Progresso atualizado para ${progress}%`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    onOpen();
  };

  const handleNewGoal = () => {
    setEditingGoal(null);
    onOpen();
  };



  const activeGoals = filteredGoals.filter(goal => goal.status === 'ativa');
  const completedGoals = filteredGoals.filter(goal => goal.status === 'concluida');
  const pausedGoals = filteredGoals.filter(goal => goal.status === 'pausada');

  const totalGoals = goals.length;
  const completedCount = goals.filter(goal => goal.status === 'concluida').length;
  const activeCount = goals.filter(goal => goal.status === 'ativa').length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="stretch" mb={8} spacing={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="gray.700">
            Gerenciar Metas
          </Heading>
          <Button
            colorScheme="purple"
            leftIcon={<Plus size={16} />}
            onClick={handleNewGoal}
          >
            Nova Meta
          </Button>
        </Flex>
        <Text color="gray.600">
          Defina e acompanhe suas metas pessoais e profissionais
        </Text>
      </VStack>

      {/* Filtros e Busca */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <VStack spacing={4}>
            <HStack w="full" spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Buscar</FormLabel>
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Categoria</FormLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas as categorias</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="familia">Família</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="saude">Saúde</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Status</FormLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="ativa">Ativa</option>
                  <option value="concluida">Concluída</option>
                  <option value="pausada">Pausada</option>
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Estatísticas */}
      <HStack spacing={6} mb={6}>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Total de Metas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                {totalGoals}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Ativas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {activeCount}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Concluídas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {completedCount}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Progresso Médio</Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {averageProgress}%
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </HStack>

      {/* Lista de Metas */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Target size={16} />
              <Text>Ativas ({activeGoals.length})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Award size={16} />
              <Text>Concluídas ({completedGoals.length})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <TrendingUp size={16} />
              <Text>Pausadas ({pausedGoals.length})</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={6}>
            {activeGoals.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onProgressChange={handleProgressChange}
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                Nenhuma meta ativa encontrada!
              </Alert>
            )}
          </TabPanel>

          <TabPanel p={0} pt={6}>
            {completedGoals.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onProgressChange={handleProgressChange}
                    isReadOnly
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                Nenhuma meta concluída ainda!
              </Alert>
            )}
          </TabPanel>

          <TabPanel p={0} pt={6}>
            {pausedGoals.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {pausedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onProgressChange={handleProgressChange}
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                Nenhuma meta pausada!
              </Alert>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal de Meta */}
      <GoalModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        goal={editingGoal}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
};

// Componente Card de Meta
interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onProgressChange: (goalId: string, progress: number) => void;
  isReadOnly?: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onProgressChange,
  isReadOnly = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2}>
                <Text fontSize="lg" fontWeight="bold">
                  {goal.title}
                </Text>
                <Badge colorScheme={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </HStack>
              <HStack spacing={2} color="gray.600">
                <Text fontSize="sm">{getCategoryIcon(goal.category)} {goal.category}</Text>
                {goal.dueDate && (
                  <Text fontSize="sm">
                    <Calendar size={12} /> {formatRelativeDate(goal.dueDate)}
                  </Text>
                )}
              </HStack>
            </VStack>
            {!isReadOnly && (
              <HStack spacing={2}>
                <IconButton
                  aria-label="Editar meta"
                  icon={<Edit size={16} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(goal)}
                />
                <IconButton
                  aria-label="Excluir meta"
                  icon={<Trash2 size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(goal.id)}
                />
              </HStack>
            )}
          </Flex>

          {/* Descrição */}
          {goal.description && (
            <Text color="gray.600" fontSize="sm">
              {goal.description}
            </Text>
          )}

          {/* Progresso */}
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium">
                Progresso
              </Text>
              <Text fontSize="sm" color="gray.600">
                {goal.progress}%
              </Text>
            </Flex>
            <Progress
              value={goal.progress}
              colorScheme={goal.progress >= 100 ? 'green' : 'blue'}
              size="lg"
              borderRadius="full"
            />
            {!isReadOnly && goal.status === 'ativa' && (
              <Slider
                value={goal.progress}
                onChange={(value) => onProgressChange(goal.id, value)}
                min={0}
                max={100}
                step={5}
                size="sm"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};



// Componente Modal para Criar/Editar Meta
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalForm) => void;
  goal: Goal | null;
  isSubmitting: boolean;
}

const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  isSubmitting,
}) => {
  const [form, setForm] = useState<GoalForm>({
    title: '',
    description: '',
    category: 'pessoal',
    dueDate: undefined,
  });

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title,
        description: goal.description || '',
        category: goal.category,
        dueDate: goal.dueDate,
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: 'pessoal',
        dueDate: undefined,
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da meta"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite uma descrição (opcional)"
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="trabalho">Trabalho</option>
                    <option value="familia">Família</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="saude">Saúde</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Data Limite</FormLabel>
                  <Input
                    type="date"
                    value={form.dueDate ? form.dueDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      dueDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </FormControl>
              </HStack>
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
              {goal ? 'Atualizar' : 'Criar'} Meta
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 